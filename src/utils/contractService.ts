import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import { 
  JobContract, 
  JobStatus, 
  ReputationData, 
  CreateJobParams, 
  TransactionResult,
  ContractConfig 
} from '@/types/contracts';

// Contract configuration - Updated with deployed contract IDs
const TESTNET_CONFIG: ContractConfig = {
  escrowAppId: 742004772, // Deployed Escrow Contract
  sbtAppId: 742004783,    // Deployed Reputation SBT Contract
  network: 'testnet'
};

const ALGORAND_NODE_URL = 'https://testnet-api.algonode.cloud';
const ALGORAND_NODE_PORT = 443;

export class ContractService {
  private algodClient: algosdk.Algodv2;
  private peraWallet: PeraWalletConnect;
  private config: ContractConfig;

  constructor(peraWallet: PeraWalletConnect, config = TESTNET_CONFIG) {
    this.algodClient = new algosdk.Algodv2('', ALGORAND_NODE_URL, ALGORAND_NODE_PORT);
    this.peraWallet = peraWallet;
    this.config = config;
  }

  /**
   * Create a new freelance job with escrow
   */
  async createJob(
    clientAddress: string,
    params: CreateJobParams
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: clientAddress,
        suggestedParams,
        appIndex: this.config.escrowAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('create_job')),
          algosdk.encodeUint64(params.amount * 1000000), // Convert to microAlgos
          algosdk.encodeUint64(params.deadline),
        ],
      });

      // Create payment transaction for escrow
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: clientAddress,
        receiver: algosdk.getApplicationAddress(this.config.escrowAppId),
        amount: params.amount * 1000000,
        suggestedParams,
      });

      // Group transactions
      const txnGroup = [appCallTxn, paymentTxn];
      algosdk.assignGroupID(txnGroup);

      // Sign with Pera Wallet
      const signedTxns = await this.peraWallet.signTransaction([
        txnGroup.map(txn => ({ txn, signers: [clientAddress] }))
      ]);

      // Submit to blockchain
      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: this.config.escrowAppId
      };

    } catch (error) {
      console.error('Error creating job:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's reputation data
   */
  async getUserReputation(userAddress: string): Promise<ReputationData | null> {
    try {
      const accountInfo = await this.algodClient.accountApplicationInformation(
        userAddress,
        this.config.sbtAppId
      ).do();

      if (!accountInfo.appLocalState || !accountInfo.appLocalState.keyValue) {
        return null;
      }

      const localState = accountInfo.appLocalState.keyValue;
      const reputation: Partial<ReputationData> = {};

      localState.forEach((item: any) => {
        const key = Buffer.from(item.key, 'base64').toString();
        const value = item.value.uint || 0;

        switch (key) {
          case 'sbt_count':
            reputation.sbtCount = value;
            break;
          case 'positive':
            reputation.positiveRating = value;
            break;
          case 'negative':
            reputation.negativeRating = value;
            break;
          case 'last_earned':
            reputation.lastEarned = value;
            break;
          case 'juror_eligible':
            reputation.jurorEligible = value === 1;
            break;
        }
      });

      // Calculate reputation score
      const totalJobs = reputation.sbtCount || 0;
      const positive = reputation.positiveRating || 0;
      const negative = reputation.negativeRating || 0;
      
      let reputationScore = 50; // Default for new users
      if (totalJobs > 0) {
        reputationScore = Math.max(0, Math.min(100, ((positive - negative) / totalJobs) * 100));
      }

      return {
        sbtCount: totalJobs,
        positiveRating: positive,
        negativeRating: negative,
        lastEarned: reputation.lastEarned || 0,
        jurorEligible: reputation.jurorEligible || false,
        reputationScore,
      };

    } catch (error) {
      console.error('Error getting user reputation:', error);
      return null;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txId: string): Promise<any> {
    let response = await this.algodClient.status().do();
    let lastRound = response.lastRound;
    
    while (true) {
      const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      
      if (pendingInfo.confirmedRound !== null && pendingInfo.confirmedRound !== undefined && pendingInfo.confirmedRound > 0) {
        return pendingInfo;
      }
      
      lastRound++;
      await this.algodClient.statusAfterBlock(lastRound).do();
    }
  }

  /**
   * Update contract configuration (after deployment)
   */
  updateConfig(config: ContractConfig) {
    this.config = config;
  }
}

// Singleton instance
let contractService: ContractService | null = null;

export const getContractService = (peraWallet: PeraWalletConnect): ContractService => {
  if (!contractService) {
    contractService = new ContractService(peraWallet);
  }
  return contractService;
}; 
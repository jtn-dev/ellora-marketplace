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
   * Accept a job as a freelancer
   */
  async acceptJob(
    freelancerAddress: string,
    jobAppId: number
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: freelancerAddress,
        suggestedParams,
        appIndex: jobAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('accept_job')),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [freelancerAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: jobAppId
      };

    } catch (error) {
      console.error('Error accepting job:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Mark job as completed by freelancer
   */
  async completeJob(
    freelancerAddress: string,
    jobAppId: number
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: freelancerAddress,
        suggestedParams,
        appIndex: jobAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('complete_job')),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [freelancerAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: jobAppId
      };

    } catch (error) {
      console.error('Error completing job:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Approve job completion and release funds
   */
  async approveCompletion(
    clientAddress: string,
    jobAppId: number
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: clientAddress,
        suggestedParams,
        appIndex: jobAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('approve_completion')),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [clientAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: jobAppId
      };

    } catch (error) {
      console.error('Error approving completion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Raise a dispute on a job
   */
  async raiseDispute(
    userAddress: string,
    jobAppId: number
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: userAddress,
        suggestedParams,
        appIndex: jobAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('raise_dispute')),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [userAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: jobAppId
      };

    } catch (error) {
      console.error('Error raising dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Vote on a dispute (for jurors)
   */
  async voteOnDispute(
    jurorAddress: string,
    jobAppId: number,
    voteForFreelancer: boolean
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: jurorAddress,
        suggestedParams,
        appIndex: jobAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('vote_dispute')),
          algosdk.encodeUint64(voteForFreelancer ? 1 : 0),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [jurorAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: jobAppId
      };

    } catch (error) {
      console.error('Error voting on dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Mint SBT token for completed job
   */
  async mintSBT(
    userAddress: string,
    rating: number
  ): Promise<TransactionResult> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: userAddress,
        suggestedParams,
        appIndex: this.config.sbtAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('mint_sbt')),
          algosdk.encodeUint64(rating),
        ],
      });

      const signedTxns = await this.peraWallet.signTransaction([
        [{ txn: appCallTxn, signers: [userAddress] }]
      ]);

      const response = await this.algodClient.sendRawTransaction(signedTxns).do();
      const txId = response.txid;
      
      await this.waitForConfirmation(txId);

      return {
        success: true,
        txId,
        appId: this.config.sbtAppId
      };

    } catch (error) {
      console.error('Error minting SBT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get job contract state
   */
  async getJobState(jobAppId: number): Promise<JobContract | null> {
    try {
      const appInfo = await this.algodClient.getApplicationByID(jobAppId).do();
      
      if (!appInfo.params.globalState) {
        return null;
      }

      const globalState = appInfo.params.globalState;
      const jobData: Partial<JobContract> = { appId: jobAppId };

      globalState.forEach((item: any) => {
        const key = Buffer.from(item.key, 'base64').toString();
        
        switch (key) {
          case 'client':
            jobData.clientAddress = algosdk.encodeAddress(Buffer.from(item.value.bytes, 'base64'));
            break;
          case 'freelancer':
            if (item.value.bytes) {
              jobData.freelancerAddress = algosdk.encodeAddress(Buffer.from(item.value.bytes, 'base64'));
            }
            break;
          case 'amount':
            jobData.amount = item.value.uint / 1000000; // Convert from microAlgos
            break;
          case 'status':
            jobData.status = item.value.uint as JobStatus;
            break;
          case 'created':
            jobData.createdTimestamp = item.value.uint;
            break;
          case 'deadline':
            jobData.deadlineTimestamp = item.value.uint;
            break;
          case 'votes_for':
            jobData.disputeVotesFor = item.value.uint;
            break;
          case 'votes_against':
            jobData.disputeVotesAgainst = item.value.uint;
            break;
          case 'jurors':
            jobData.totalJurors = item.value.uint;
            break;
        }
      });

      return jobData as JobContract;

    } catch (error) {
      console.error('Error getting job state:', error);
      return null;
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
   * Check if contracts are accessible and funded
   */
  async verifyContractHealth(): Promise<{
    escrowHealthy: boolean;
    sbtHealthy: boolean;
    escrowBalance: number;
    sbtBalance: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let escrowHealthy = false;
    let sbtHealthy = false;
    let escrowBalance = 0;
    let sbtBalance = 0;

    try {
      // Check escrow contract
      await this.algodClient.getApplicationByID(this.config.escrowAppId).do();
      escrowHealthy = true;
      
      const escrowAddress = algosdk.getApplicationAddress(this.config.escrowAppId);
      const escrowAccountInfo = await this.algodClient.accountInformation(escrowAddress).do();
      escrowBalance = escrowAccountInfo.amount / 1000000;
      
    } catch (error) {
      errors.push(`Escrow contract error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Check SBT contract
      await this.algodClient.getApplicationByID(this.config.sbtAppId).do();
      sbtHealthy = true;
      
      const sbtAddress = algosdk.getApplicationAddress(this.config.sbtAppId);
      const sbtAccountInfo = await this.algodClient.accountInformation(sbtAddress).do();
      sbtBalance = sbtAccountInfo.amount / 1000000;
      
    } catch (error) {
      errors.push(`SBT contract error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      escrowHealthy,
      sbtHealthy,
      escrowBalance,
      sbtBalance,
      errors
    };
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txId: string): Promise<any> {
    const response = await this.algodClient.status().do();
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
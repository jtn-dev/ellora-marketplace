export interface JobContract {
  appId: number;
  clientAddress: string;
  freelancerAddress?: string;
  amount: number;
  status: JobStatus;
  createdTimestamp: number;
  deadlineTimestamp: number;
  disputeVotesFor: number;
  disputeVotesAgainst: number;
  totalJurors: number;
}

export enum JobStatus {
  Created = 0,
  InProgress = 1,
  Completed = 2,
  Disputed = 3,
  Resolved = 4,
}

export interface ReputationData {
  sbtCount: number;
  positiveRating: number;
  negativeRating: number;
  lastEarned: number;
  jurorEligible: boolean;
  reputationScore: number;
}

export interface ContractConfig {
  escrowAppId: number;
  sbtAppId: number;
  network: 'testnet' | 'mainnet';
}

export interface CreateJobParams {
  amount: number;
  deadline: number;
  description: string;
  requirements: string[];
}

export interface TransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
  appId?: number;
}

export interface ContractHealthStatus {
  escrowHealthy: boolean;
  sbtHealthy: boolean;
  escrowBalance: number;
  sbtBalance: number;
  errors: string[];
}
export interface WalletConnection {
  address: string;
  isConnected: boolean;
  balance: number;
}

export interface User {
  id: string;
  address: string;
  email?: string;
  name?: string;
  userType: 'client' | 'freelancer';
  avatar?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  completedJobs?: number;
  joinedDate: Date;
}

export interface PeraWalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

export interface WalletContextType {
  walletState: PeraWalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}
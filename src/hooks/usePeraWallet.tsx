'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import { PeraWalletState, WalletContextType } from '@/types/wallet';

const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: false,
});

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const ALGORAND_NODE_URL = 'https://testnet-api.algonode.cloud';
const ALGORAND_NODE_PORT = 443;

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletState, setWalletState] = useState<PeraWalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    isLoading: false,
    error: null,
  });
  const [mounted, setMounted] = useState(false);

  const algodClient = useMemo(() => new algosdk.Algodv2('', ALGORAND_NODE_URL, ALGORAND_NODE_PORT), []);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      // Validate address format
      if (!address || address.length !== 58) {
        throw new Error('Invalid address format');
      }
      
      const accountInfo = await algodClient.accountInformation(address).do();
      const balance = Number(accountInfo.amount) / 1000000; // Convert microAlgos to Algos
      
      setWalletState(prev => ({
        ...prev,
        balance,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      
      let errorMessage = 'Failed to fetch balance';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error - please check your connection';
        } else if (error.message.includes('Invalid address')) {
          errorMessage = 'Invalid wallet address';
        } else if (error.message.includes('404')) {
          errorMessage = 'Account not found - please fund your wallet';
        } else {
          errorMessage = `Balance fetch error: ${error.message}`;
        }
      }
      
      setWalletState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, [algodClient]);

  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return;
    await fetchBalance(walletState.address);
  }, [walletState.address, fetchBalance]);

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newAccounts = await peraWallet.connect();
      
      if (newAccounts.length > 0) {
        const address = newAccounts[0];
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address,
          isLoading: false,
          error: null,
        }));
        
        // Save to localStorage for persistence (only on client)
        if (typeof window !== 'undefined') {
          localStorage.setItem('peraWallet-address', address);
        }
        
        // Get balance (don't fail connection if balance fetch fails)
        try {
          await fetchBalance(address);
        } catch (balanceError) {
          console.warn('Failed to fetch balance after connection:', balanceError);
          // Connection is still successful even if balance fetch fails
        }
      } else {
        throw new Error('No accounts selected');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = 'Failed to connect wallet';
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('cancelled')) {
          errorMessage = 'Connection cancelled by user';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error - please check your connection and try again';
        } else if (error.message.includes('No accounts')) {
          errorMessage = 'No wallet accounts found';
        } else {
          errorMessage = 'Failed to connect wallet. Please try again.';
        }
      }
      
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const disconnectWallet = useCallback(() => {
    try {
      peraWallet.disconnect();
      setWalletState({
        isConnected: false,
        address: null,
        balance: 0,
        isLoading: false,
        error: null,
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('peraWallet-address');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to disconnect wallet',
      }));
    }
  }, []);

  // Check for existing connection on mount (only on client)
  useEffect(() => {
    setMounted(true);
    
    const checkExistingConnection = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const savedAddress = localStorage.getItem('peraWallet-address');
        
        if (savedAddress) {
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            address: savedAddress,
          }));
          
          await fetchBalance(savedAddress);
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
        // Clear invalid saved address
        if (typeof window !== 'undefined') {
          localStorage.removeItem('peraWallet-address');
        }
      }
    };

    checkExistingConnection();
  }, [fetchBalance]);

  // Listen for account changes
  useEffect(() => {
    if (!mounted) return;
    
    const handleDisconnect = () => {
      disconnectWallet();
    };

    peraWallet.connector?.on('disconnect', handleDisconnect);

    return () => {
      peraWallet.connector?.off('disconnect', handleDisconnect);
    };
  }, [mounted, disconnectWallet]);

  // Auto-refresh balance periodically
  useEffect(() => {
    if (!walletState.isConnected || !walletState.address) return;

    const interval = setInterval(() => {
      refreshBalance();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [walletState.isConnected, walletState.address, refreshBalance]);

  const value: WalletContextType = {
    walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function usePeraWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('usePeraWallet must be used within a WalletProvider');
  }
  return context;
}
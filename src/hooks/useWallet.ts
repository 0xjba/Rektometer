// hooks/useWallet.ts
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../types';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({ ...prev, error: 'Please install a Web3 wallet' }));
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setWalletState({
        address,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      setWalletState({
        address: null,
        isConnecting: false,
        error: 'Failed to connect wallet',
      });
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  return { ...walletState, connectWallet, disconnectWallet };
}
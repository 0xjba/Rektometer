import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  showNetworkModal: boolean;
}

const TEN_CHAIN_ID = '0x1bb';

export async function checkIsCorrectNetwork(): Promise<boolean> {
  if (!window.ethereum) return false;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId === TEN_CHAIN_ID;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    error: null,
    showNetworkModal: false
  });

  const switchToTenNetwork = async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TEN_CHAIN_ID }],
      });
      return true;
    } catch (error) {
      setWalletState(prev => ({ ...prev, showNetworkModal: true }));
      return false;
    }
  };

  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) return false;

    const chainId = await window.ethereum.request({ 
      method: 'eth_chainId' 
    });

    if (chainId !== TEN_CHAIN_ID) {
      return await switchToTenNetwork();
    }

    return true;
  };

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({ ...prev, error: 'Please install a Web3 wallet' }));
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

      const networkSwitched = await checkAndSwitchNetwork();
      if (!networkSwitched) {
        setWalletState(prev => ({
          ...prev,
          address: null,
          isConnecting: false,
          error: 'Please switch to TEN Testnet'
        }));
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setWalletState({
        address,
        isConnecting: false,
        error: null,
        showNetworkModal: false
      });
    } catch (error) {
      setWalletState({
        address: null,
        isConnecting: false,
        error: 'Failed to connect wallet',
        showNetworkModal: false
      });
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnecting: false,
      error: null,
      showNetworkModal: false
    });
  }, []);

  const closeNetworkModal = () => {
    setWalletState(prev => ({ ...prev, showNetworkModal: false }));
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = (chainId: string) => {
      if (chainId !== TEN_CHAIN_ID) {
        setWalletState({
          address: null,
          isConnecting: false,
          error: 'Please switch to TEN Testnet',
          showNetworkModal: true
        });
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    closeNetworkModal
  };
}

export type { WalletState };
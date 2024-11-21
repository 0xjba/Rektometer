import React from 'react';
import { Terminal, Wallet } from 'lucide-react';
import type { WalletState } from '../types';

interface HeaderProps {
  wallet: WalletState & { 
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
  };
}

export function Header({ wallet }: HeaderProps) {
  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <header className="border-b border-gray-800 bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-8 w-8" />
            <h1 className="text-2xl font-mono font-bold tracking-tight">REKTOMETER</h1>
          </div>
          
          {wallet.error && (
            <div className="text-red-500 font-mono text-sm">
              {wallet.error}
            </div>
          )}

          <button
            onClick={wallet.address ? wallet.disconnectWallet : wallet.connectWallet}
            disabled={wallet.isConnecting}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 
                     disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 
                     rounded-md font-mono transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>
              {wallet.isConnecting ? 'Connecting...' :
               wallet.address ? formatAddress(wallet.address) :
               'Connect Wallet'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
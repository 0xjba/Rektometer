// components/NetworkModal.tsx
import { X } from 'lucide-react';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NetworkModal({ isOpen, onClose }: NetworkModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-lg bitmap-border w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Network Not Found</h2>
        
        <p className="text-gray-400 mb-6">
          Please add TEN Testnet to your wallet by visiting TEN Gateway
        </p>

        <div className="flex justify-end gap-4">
          <a
            href="https://testnet.ten.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-900/50 hover:bg-red-900 
                     bitmap-border border-red-900 rounded font-bold 
                     transition-colors"
            onClick={onClose}
          >
            Visit TEN Gateway
          </a>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  isSubmitting: boolean;
}

export function AddProjectModal({ isOpen, onClose, onSubmit, isSubmitting }: AddProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, description);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-lg bitmap-border w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Project Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded bitmap-border 
                       focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description*
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded bitmap-border 
                       focus:outline-none focus:ring-1 focus:ring-red-500"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     bitmap-border border-red-900 rounded font-bold 
                     transition-colors"
          >
            {isSubmitting ? 'Adding Project...' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
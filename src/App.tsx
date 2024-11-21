import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProjectList } from './components/ProjectList';
import { AddProjectModal } from './components/AddProjectModal';
import { NetworkModal } from './components/NetworkModal';
import { useWallet } from './hooks/useWallet';
import { useProjects } from './hooks/useProjects';
import { PlusCircle } from 'lucide-react';
import type { Project } from './types';

function App() {
  const wallet = useWallet();
  const { 
    projects, 
    isLoading, 
    error,
    isSubmitting,
    voteForProject,
    addProject 
  } = useProjects(wallet.address);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = async (name: string, description: string) => {
    try {
      await addProject(name, description);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add project:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header wallet={wallet} />
      <main className="container mx-auto px-4 py-8">
        <div className="font-mono mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl">RECKOMETER</h2>
            {wallet.address && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 
                         hover:bg-gray-700 rounded bitmap-border transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Project
              </button>
            )}
          </div>
          
          {!wallet.address ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg bitmap-border p-8">
              <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-gray-400">
                Connect your wallet to view and rate projects.
              </p>
            </div>
          ) : error === 'Please switch to TEN Network' ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg bitmap-border p-8">
              <h3 className="text-xl font-bold mb-4">Wrong Network</h3>
              <p className="text-gray-400 mb-4">
                Please switch to TEN Network to continue.
              </p>
              <button
                onClick={wallet.connectWallet}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-900 
                         bitmap-border border-red-900 rounded font-bold"
              >
                Switch Network
              </button>
            </div>
          ) : (
            <>
              <ProjectList 
                projects={projects}
                isLoading={isLoading}
                onVote={voteForProject}
                isWalletConnected={!!wallet.address}
              />
            </>
          )}
        </div>

        <NetworkModal 
          isOpen={wallet.showNetworkModal} 
          onClose={wallet.closeNetworkModal}
        />
        
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProject}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}

export default App;
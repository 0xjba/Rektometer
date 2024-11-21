import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProjectList } from './components/ProjectList';
import { AddProjectModal } from './components/AddProjectModal';
import { useWallet } from './hooks/useWallet';
import { useProjects } from './hooks/useProjects';
import { PlusCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const wallet = useWallet();
  const { projects, isLoading, error, voteForProject, addProject, isSubmitting } = useProjects();
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
      <Toaster position="top-right" />
      <Header wallet={wallet} />
      <main className="container mx-auto px-4 py-8">
        <div className="font-mono mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl">ANONYMOUS WEB3 PROJECT RATINGS</h2>
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
                Connect your wallet to view and rate projects that rekt you.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-center mb-8">
              No traces. No trails. Just truth. Rate the rekt in complete anonymity!
              </p>
              
              {error && (
                <div className="text-red-500 text-center mb-4">
                  {error}
                </div>
              )}

              <ProjectList 
                projects={projects}
                isLoading={isLoading}
                onVote={voteForProject}
                isWalletConnected={!!wallet.address}
              />
            </>
          )}
        </div>

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
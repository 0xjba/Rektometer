import React, { useState, useMemo } from 'react';
import { ExternalLink, Skull, AlertTriangle } from 'lucide-react';
import type { Project } from '../types';
import { SearchBar } from './Searchbar';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  onVote: (projectId: string) => Promise<void>;
  isWalletConnected: boolean;
}

export function ProjectList({ projects, isLoading, onVote, isWalletConnected }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Don't show search bar if not connected
  if (!isWalletConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg bitmap-border" />
          ))}
        </div>
      </>
    );
  }

  if (!projects.length) {
    return (
      <>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="text-center py-12 bg-gray-800 rounded-lg bitmap-border p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
          <p className="text-gray-400">Be the first to add a project!</p>
        </div>
      </>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="text-center py-12 bg-gray-800 rounded-lg bitmap-border p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Results Found</h3>
          <p className="text-gray-400">
            No projects match your search. Try different keywords.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      
      {filteredProjects.map((project) => (
        <div key={project.id} 
             className="bg-gray-800 p-6 rounded-lg bitmap-border hover:bg-gray-750 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg bitmap-border flex-shrink-0 flex items-center justify-center">
              {project.iconUrl ? (
                <img 
                  src={project.iconUrl} 
                  alt={project.name} 
                  className="w-12 h-12 rounded"
                />
              ) : (
                <Skull className="w-8 h-8 text-gray-500" />
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold truncate">{project.name}</h3>
                {project.projectUrl && (
                  <a href={project.projectUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-gray-300 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-gray-400 text-sm truncate">{project.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{project.reckScore}</div>
                <div className="text-xs text-gray-400">REKT SCORE</div>
              </div>
              
              <button
                onClick={() => onVote(project.id)}
                disabled={!isWalletConnected}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-900 disabled:opacity-50 
                         disabled:cursor-not-allowed bitmap-border border-red-900 
                         rounded text-sm font-bold transition-colors"
                title={!isWalletConnected ? "Connect wallet to vote" : "Vote"}
              >
                REKT
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
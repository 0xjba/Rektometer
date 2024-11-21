import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { RECKOMETER_ADDRESS, RECKOMETER_ABI } from '../config/contract';
import { checkIsCorrectNetwork } from './useWallet';
import type { Project } from '../types';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  voteForProject: (projectId: string) => Promise<void>;
  addProject: (name: string, description: string) => Promise<void>;
}

export function useProjects(walletAddress: string | null): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getContract = useCallback(async (withSigner = false) => {
    if (!window.ethereum || !walletAddress) return null;
    
    const isCorrectNetwork = await checkIsCorrectNetwork();
    if (!isCorrectNetwork) {
      setError('Please switch to TEN Network');
      return null;
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(RECKOMETER_ADDRESS, RECKOMETER_ABI, signer);
    }
    return new ethers.Contract(RECKOMETER_ADDRESS, RECKOMETER_ABI, provider);
  }, [walletAddress]);

  const fetchProjects = useCallback(async () => {
    if (!walletAddress) {
      setProjects([]);
      setError(null);
      return;
    }

    try {
      const contract = await getContract();
      if (!contract) return;

      setIsLoading(true);
      setError(null);

      const [names, descriptions, iconUrls, projectUrls, reckScores] = await contract.getAllProjects();
      
      if (!names || names.length === 0) {
        setProjects([]);
        return;
      }

      const formattedProjects = names.map((name: string, index: number) => ({
        id: (index + 1).toString(),
        name,
        description: descriptions[index],
        iconUrl: iconUrls[index] || '',
        projectUrl: projectUrls[index] || '',
        reckScore: Number(reckScores[index])
      }));

      formattedProjects.sort((a, b) => b.reckScore - a.reckScore);
      setProjects(formattedProjects);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      if (walletAddress) {
        setError('Failed to fetch projects');
      }
    } finally {
      setIsLoading(false);
    }
  }, [getContract, walletAddress]);

  const voteForProject = useCallback(async (projectId: string) => {
    if (!walletAddress) return;

    try {
      const contract = await getContract(true);
      if (!contract) return;
      
      const tx = await contract.increaseReckScore(projectId);
      await tx.wait();
      await fetchProjects();
    } catch (err: any) {
      console.error('Error voting for project:', err);
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected');
      } else {
        setError('Failed to vote for project');
      }
      throw err;
    }
  }, [getContract, fetchProjects, walletAddress]);

  const addProject = useCallback(async (name: string, description: string) => {
    if (!walletAddress) return;
    
    setIsSubmitting(true);
    try {
      const contract = await getContract(true);
      if (!contract) return;
      
      const tx = await contract.addProject(name, description);
      await tx.wait();
      await fetchProjects();
    } catch (err: any) {
      console.error('Error adding project:', err);
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected');
      } else if (err.message?.includes('ProjectAlreadyExists')) {
        setError('A project with this name already exists');
      } else {
        setError('Failed to add project');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [getContract, fetchProjects, walletAddress]);

  useEffect(() => {
    let mounted = true;

    if (walletAddress) {
      checkIsCorrectNetwork().then(isCorrect => {
        if (mounted && isCorrect) {
          fetchProjects();
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [walletAddress, fetchProjects]);

  // Return all the values and functions
  return {
    projects,
    isLoading,
    error,
    isSubmitting,
    voteForProject: voteForProject,
    addProject: addProject
  };
}
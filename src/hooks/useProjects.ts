// hooks/useProjects.ts
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { RECKOMETER_ADDRESS, RECKOMETER_ABI } from '../config/contract';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getContract = useCallback(async (withSigner = false) => {
    if (!window.ethereum) throw new Error('No Web3 provider found');
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(RECKOMETER_ADDRESS, RECKOMETER_ABI, signer);
    }
    return new ethers.Contract(RECKOMETER_ADDRESS, RECKOMETER_ABI, provider);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = await getContract();

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
      
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [getContract]);

  const addProject = useCallback(async (name: string, description: string) => {
    setIsSubmitting(true);
    try {
      const contract = await getContract(true);
      const tx = await contract.addProject(name, description);
      
      await toast.promise(tx.wait(), {
        loading: 'Adding project...',
        success: 'Project added successfully!',
        error: 'Failed to add project'
      });
      
      await fetchProjects();
    } catch (err: any) {
      console.error('Error adding project:', err);
      if (err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected');
      } else if (err.message?.includes('ProjectAlreadyExists')) {
        toast.error('A project with this name already exists');
      } else {
        toast.error('Failed to add project');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [getContract, fetchProjects]);

  const voteForProject = useCallback(async (projectId: string) => {
    try {
      const contract = await getContract(true);
      const tx = await contract.increaseReckScore(projectId);
      
      await toast.promise(tx.wait(), {
        loading: 'Recording vote...',
        success: 'Vote recorded successfully!',
        error: 'Failed to record vote'
      });
      
      await fetchProjects();
    } catch (err: any) {
      console.error('Error voting for project:', err);
      if (err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected');
      } else {
        toast.error('Failed to vote for project');
      }
      throw err;
    }
  }, [getContract, fetchProjects]);

  useEffect(() => {
    let mounted = true;
    let contract: ethers.Contract | null = null;

    const setup = async () => {
      try {
        contract = await getContract();
        if (!contract || !mounted) return;
        
        contract.on('ProjectAdded', () => {
          if (mounted) {
            toast.success('New project added!');
            fetchProjects();
          }
        });
        
        contract.on('ReckScoreIncreased', () => {
          if (mounted) {
            fetchProjects();
          }
        });

        await fetchProjects();
      } catch (err) {
        console.error('Failed to setup contract:', err);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [getContract, fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    voteForProject,
    addProject,
    isSubmitting,
  };
}
// types.ts
export interface Project {
  id: string;         // Still string for consistency in React
  name: string;
  description: string;
  iconUrl: string;
  projectUrl: string;
  reckScore: number;
}

export interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}
export const RECKOMETER_ADDRESS = '0xcf135943612437354966E77cCb07873f0e570745';

export const RECKOMETER_ABI = [
  "function getAllProjects() view returns (string[], string[], string[], string[], uint256[])",
  "function getProject(uint256 projectId) view returns (string, string, string, string, uint256)",
  "function addProject(string name, string description)",
  "function increaseReckScore(uint256 projectId)",
  "function getTotalProjects() view returns (uint256)",
  "event ProjectAdded(uint256 indexed projectId)",
  "event ReckScoreIncreased(uint256 indexed projectId)"
];
export interface TeamStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  winPercentage: number;
  titlesWon: number;
  playoffAppearances: number;
  highestScore: number;
  lowestScore: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  homeGround: string;
  latitude: number;
  longitude: number;
  foundedYear: number;
  color: string;
  isActive: boolean;
  stats: TeamStats;
}

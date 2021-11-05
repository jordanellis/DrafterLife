export type Team = {
  matches: Array<string[]>;
  owner: string;
  name: string;
  wins: number;
  losses: number;
  totalPoints: number;
  players: {
    tanks: string[];
    dps: string[];
    supports: string[];
    flex: string[];
    bench: string[];
  }
}

export type ScheduledMatches = {
  matches: Array<string[]>;
}
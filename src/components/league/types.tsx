export type Team = {
  matches: Array<string[]>;
  owner: string;
  ownerName: string;
  name: string;
  wins: number;
  losses: number;
  totalPoints: number;
  players: Players;
  bio: string;
  quote: string;
}

export type Players = {
  tanks: string[];
  dps: string[];
  supports: string[];
  flex: string[];
  bench: string[];
}

export type ScheduledMatches = {
  matches: Array<string[]>;
}
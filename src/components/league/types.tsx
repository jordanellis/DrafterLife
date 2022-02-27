export interface LeagueTeam {
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

export interface Players {
  tanks: string[];
  dps: string[];
  supports: string[];
  flex: string[];
  bench: string[];
}

export interface ScheduleWeek {
  week: string;
  matches: Array<string[]>;
  final_rosters?: FinalRosters;
}

interface FinalRosters {
  [owner: string]: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
    flex: Array<string>,
    bench: Array<string>
  };
}
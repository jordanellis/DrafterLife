export type LeagueTeam = {
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

export type Schedule = {
  weeks: ScheduleWeek[];
}

export type ScheduleWeek = {
  week: string;
  matches: Array<string[]>;
  final_rosters?: FinalRosters;
}

type FinalRosters = {
  [owner: string]: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
    flex: Array<string>,
    bench: Array<string>
  };
}
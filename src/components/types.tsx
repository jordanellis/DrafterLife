export interface PlayerStatistics {
	matches: Match;
	totals: Stats;
	weekly_player_scores: WeeklyPlayerScores;
	total_player_score: number
}

export interface WeeklyPlayerScores {
	[week: number]: number;
}

export interface Match {
	[matchID: string]: MatchStats;
}

export interface MatchStats {
	week:			number;
	stage:		string;
	date:			Date;
	maps:			Maps;
	totals: 	any;
	averages: any;
	score: 		number;
}

export interface Maps {
	[mapName: string]: Stats;
}

export interface Stats {
	[statName: string]: any;
}

export interface Team {
	id: number;
	name: string;
	division: string;
	abbr: string;
	players: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
  };
	logo: string;
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	};
}
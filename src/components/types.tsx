export type PlayerStatistics = {
	matches: Match;
	totals: Stats;
	weekly_player_scores: WeeklyPlayerScores;
}

export type WeeklyPlayerScores = {
	[week: number]: number;
}

export type Match = {
	[matchID: string]: MatchStats;
}

export type MatchStats = {
	week:			number;
	stage:		string;
	date:			Date;
	maps:			Maps;
	totals: 	any;
	averages: any;
	score: 		number;
}

export type Maps = {
	[mapName: string]: Stats;
}

export type Stats = {
	[statName: string]: any;
}

export type Team = {
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
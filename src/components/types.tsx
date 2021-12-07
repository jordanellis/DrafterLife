export type PlayerStatistics = {
	matches: Match;
	totals: Stats;
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
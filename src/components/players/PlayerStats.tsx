import { Alert, Box, Button, Card, CardContent, Collapse, Container, Divider, IconButton, MenuItem, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';

type PlayerStatsProps = {
	teamname: string;
	role: string;
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	}
}

type PlayerStatistics = {
	matches: Match;
	totals: Stats;
}

type Match = {
	[matchID: string]: MatchStats;
}

type MatchStats = {
	week:			number;
	stage:		string;
	date:			Date;
	maps:			Maps;
	totals: 	any;
	averages: any;
}

type Maps = {
	[U: string]: Stats;
}

type Stats = {
	[U: string]: any;
}

type Week = {
	week: number;
	stage: string;
	start: Date;
	stop: Date;
}

type PlayerStatsParams = {
	player: string;
};

const ALL_HEROES = "All Heroes";
const MATCH_TOTALS = "totals";

const rows = [
	{key: "Eliminations", label: "Eliminations", header: true},
	{key: "Hero Damage Done", label: "Damage", header: true},
	{key: "Healing Done", label: "Healing", header: true},
	{key: "Deaths", label: "Deaths", header: true},
	{key: "Final Blows", label: "Final Blows", header: false},
	{key: "Assists", label: "Assists", header: false},
	{key: "Time Played", label: "Time Played", header: true}
];

function Row({ stats, colors }: { stats: MatchStats, colors: any }) {
  const [open, setOpen] = React.useState(false);
	
  return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: colors.primary+"22" }}>
				<TableCell>
					<IconButton
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{stats.date && new Date(stats.date).getMonth()+1 + '/' + new Date(stats.date).getDate()}
				</TableCell>
				{rows.map((row, index) => (
					row.header && <TableCell key={index} align="right">{stats[MATCH_TOTALS][row.key]}</TableCell>
				))}
			</TableRow>
			<TableRow sx={{ bgcolor: colors.primary+"80" }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Map Breakdown
							</Typography>
							<Table size="small" >
								<TableHead>
									<TableRow>
										<TableCell>Map Name</TableCell>
										{rows.map((row, index) => (
											<TableCell key={index} align="right">{row.label}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{
										Object.keys(stats.maps).map((key, index) => {
											return (
												<TableRow key={index}>
													<TableCell component="th" scope="row">
														{key}
													</TableCell>
													{rows.map((row, index) => (
														<TableCell key={index} align="right">
															{stats.maps[key][ALL_HEROES][row.key] ? stats.maps[key][ALL_HEROES][row.key]: 0}
														</TableCell>
													))}
												</TableRow>
											);
										})
									}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
  );
}

export default function PlayerStats({location}: any) {
	const { teamname, colors, role }: PlayerStatsProps = location.state;
	const { player } = useParams<PlayerStatsParams>();

	const [loading, setLoading] = useState(true);
	const [playerStats, setPlayerStats] = useState<PlayerStatistics>();
	const [currentStage, setCurrentStage] = useState("");
	const [stages, setStages] = useState<string[]>([]);
	const [sortedMatches, setSortedMatches] = useState<(string | MatchStats)[][]>([]);
	
	useEffect(() => {
		Promise.all([
			fetchPlayerStats(player),
			fetchWeeks()
		]).then(([stats, weeks]: [PlayerStatistics, Week[]]) => {
			if (stats && stats !== undefined) {
				const stagesArray: string[] = [];
				weeks.forEach(week => {
					if (!stagesArray.includes(week.stage)) {
						stagesArray.push(week.stage);
					}
				});
				stagesArray.push("All Matches")
				setStages(stagesArray);
				setCurrentStage(stagesArray[stagesArray.length-1]);
				mapMatchIDsToWeeks(stats, weeks);
				setPlayerStats(stats);
				var sortable = [];
				for (var match in stats.matches) {
						sortable.push([match, stats.matches[match]]);
				}
				sortable.sort(function(a, b) {
					const matchA = a[1] as MatchStats;
					const matchB = b[1] as MatchStats;
					if (matchA.date && matchB.date) {
						return (new Date(matchA.date) > new Date(matchB.date)) ? 1 : -1;
					} else {
						return 0;
					}
				});
				setSortedMatches(sortable);
			}
			setLoading(false);
		}).catch((err) => {
				console.log(err);
		});
	}, [player]);

	const fetchPlayerStats = async (player: String) => {
    const response = await fetch("/api/player-stats/" + player);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.data;
  };

	const fetchWeeks = async () => {
		const response = await fetch("/api/games/weeks");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.data;
	}

	const mapMatchIDsToWeeks = (stats: PlayerStatistics, weeks: Week[]) => {
		for (const [key, value] of Object.entries(stats.matches)) {
			weeks.forEach(week => {
				const date = new Date(value.date).getTime();
				const weekStart = new Date(week.start).getTime();
				const weekStop = new Date(week.stop).getTime();
				if (weekStart < date && date < weekStop) {
					stats.matches[key].week = week.week;
					stats.matches[key].stage = week.stage;
				}
			})
		}
	}

  const stageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStage(event.target.value);
  };

	const displayPlayerAverages = (statKeys: string[]) => {
		return (
			<Container sx={{ display: "flex", flexDirection: "row" }}>
				{statKeys.map((statKey, i) => (
				<Container key={i} >
					<Typography variant="subtitle1">
						{ statKey }
					</Typography>
					<Typography variant="h4">
						{ playerStats && (playerStats.totals[statKey]/playerStats.totals['Time Played']*600).toFixed(4) }
					</Typography>
				</Container>
				))}
			</Container>
		)
	}
	
  return (
		<div>
			<Link style={{ textDecoration: "none" }} to="/teams/">
				<Button variant="text" color="secondary">
					{"< Teams"}
				</Button>
			</Link>
			<Card sx={{ maxWidth: 900, display: "flex", flexDirection: "row", m: "auto" }}>
				<Box sx={{ maxWidth: 210, background: colors.primary, flex: 1 }}>
					<CardContent sx={{ padding: "1!important" }}>
						<PersonIcon sx={{ fontSize: "11rem!important" }} />
						<Typography variant="body1">
							{ teamname }
						</Typography>
						<Divider sx={{ background: colors.tertiary, opacity: 0.2, marginTop: 1, marginBottom: 1 }} />
						{role.match("tank") && <ShieldIcon
							fontSize="medium"
							sx={{ display: "inline", float: "left", color: colors.secondary }}
							/>}
						{role.match("dps") && <SportsMmaIcon
							fontSize="medium"
							sx={{ display: "inline", float: "left", color: colors.secondary }}
							/>}
						{role.match("support") && <LocalHospitalIcon
							fontSize="medium"
							sx={{ display: "inline", float: "left", color: colors.secondary }}
							/>}
						<Typography variant="subtitle1" color="text.secondary" sx={{ display: "inline", paddingLeft: 1 }} >
							{ player }
						</Typography>
					</CardContent>
				</Box>
				<Box sx={{ background: colors.primary+"99", flex: 1, textAlign: "center" }}>
					<CardContent>
						<Typography variant="h6">
							Averages Per 10 Minutes
						</Typography>
						<Divider sx={{ background: colors.tertiary, opacity: 0.2, marginTop: 2, marginBottom: 7 }} />
						{role.match("tank") && displayPlayerAverages(['Eliminations', 'Hero Damage Done', 'Deaths'])}
						{role.match("dps") && displayPlayerAverages(['Final Blows', 'Eliminations', 'Hero Damage Done'])}
						{role.match("support") && displayPlayerAverages(['Healing Done', 'Assists', 'Deaths'])}
					</CardContent>
				</Box>
			</Card>
			<Container sx={{ m: 5 }} />
			{loading ? <Typography variant="h1"><Skeleton /><Skeleton /><Skeleton /></Typography> :
				playerStats && playerStats.matches && Object.keys(playerStats.matches).length > 0 ?
					<div>
						<TextField
							id="stage-select"
							select
							color="secondary"
							label="Stage"
							value={currentStage}
							onChange={stageChange}
							sx={{ m: 1 }}
						>
							{stages.map((stage) => (
								stage !== "BYE" && <MenuItem key={stage} value={stage}>
									{stage}
								</MenuItem>
							))}
						</TextField>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow >
										<TableCell />
										<TableCell>Date</TableCell>
										{rows.map((row, index) => (
											row.header && <TableCell key={index} align="right">{row.label}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{
										sortedMatches.map((match, i) => {
											const matchStats = match[1] as MatchStats;
											return ((currentStage === "All Matches" || matchStats.stage === currentStage) &&
												<Row key={i} stats={matchStats} colors={colors} />
											);
										})
									}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				:
					<Alert severity="info" variant="outlined" sx={{ marginLeft: 35, marginRight: 35, fontSize: 20 }}>
						We didn't find any stats for { player }. Looks like they've been riding the pine.
					</Alert>
			}
		</div>
	);
}
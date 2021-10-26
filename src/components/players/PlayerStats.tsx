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
	[matchID: string]: PlayerMatch;
}

type PlayerMatch = {
	week?:						number;
	stage?:						string;
	date?:						Date;
	[U: string]: 			any;
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
const MATCH_TOTALS = "Match Totals";

const rows = [
	{key: "Eliminations", label: "Eliminations", header: true},
	{key: "Hero Damage Done", label: "Damage", header: true},
	{key: "Healing Done", label: "Healing", header: true},
	{key: "Deaths", label: "Deaths", header: true},
	{key: "Final Blows", label: "Final Blows", header: false},
	{key: "Assists", label: "Assists", header: false},
	{key: "Time Played", label: "Time Played", header: true}
];

function Row({ stats, colors }: { stats: PlayerMatch, colors: any }) {
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
					{stats.date && new Date(stats.date).getMonth() + '/' + new Date(stats.date).getDate()}
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
										Object.keys(stats).map((key, index) => {
											if (![MATCH_TOTALS, "date", "week", "stage"].includes(key)){
												return (
													<TableRow key={index}>
														<TableCell component="th" scope="row">
															{key}
														</TableCell>
														{rows.map((row, index) => (
															<TableCell key={index} align="right">
																{stats[key][ALL_HEROES][row.key] ? stats[key][ALL_HEROES][row.key]: 0}
															</TableCell>
														))}
													</TableRow>
												);
											} else {
												return null;
											}
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
	const [playerStats, setPlayerStats] = useState<PlayerStatistics>({});
	const [currentStage, setCurrentStage] = useState("");
	const [stages, setStages] = useState<string[]>([]);
	const [sortedPlayerMatches, setSortedPlayerMatches] = useState<PlayerMatch[]>([]);
	
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
				for (var match in stats) {
						sortable.push([match, stats[match]]);
				}
				sortable.sort(function(a, b) {
					const matchA = a[1] as PlayerMatch;
					const matchB = b[1] as PlayerMatch;
					if (matchA.date && matchB.date) {
						return (new Date(matchA.date) > new Date(matchB.date)) ? 1 : -1;
					} else {
						return 0;
					}
				});
				setSortedPlayerMatches(sortable);
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
		for (const [key, value] of Object.entries(stats)) {
			weeks.forEach(week => {
				if (!value.date)
					return;
				const date = new Date(value.date).getTime();
				const weekStart = new Date(week.start).getTime();
				const weekStop = new Date(week.stop).getTime();
				if (weekStart < date && date < weekStop) {
					stats[key].week = week.week;
					stats[key].stage = week.stage;
				}
			})
		}
	}

  const stageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStage(event.target.value);
  };
	
  return (
		<div>
			<Link style={{ textDecoration: "none" }} to="/teams/">
				<Button variant="text" color="primary">
					{"< Teams"}
				</Button>
			</Link>
			<Card sx={{ margin: "auto", maxWidth: 210, background: colors.primary }}>
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
    	</Card>
			<Container sx={{ m: 5 }} />
			{loading ? <Typography variant="h1"><Skeleton /><Skeleton /><Skeleton /></Typography> :
				Object.keys(playerStats).length > 0 ?
					<div>
						<TextField
							id="stage-select"
							select
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
										sortedPlayerMatches.map((match, i) => {
											return ((currentStage === "All Matches" || match[1].stage === currentStage) &&
												<Row key={i} stats={match[1]} colors={colors} />
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
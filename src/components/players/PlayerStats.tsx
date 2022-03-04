import { Alert, Box, Button, Card, CardContent, Collapse, Container, Divider, IconButton, MenuItem, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import { MatchStats, PlayerStatistics } from "../types";
import { fetchPlayerStats, fetchPlayerTeam, fetchWeeks } from "../../service/fetches";

interface TeamResp {
	team: OWLTeam;
	role: string;
}

interface OWLTeam {
  logo: string,
  name: string,
  players: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
  },
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	}
}

interface Week {
	week: number;
	stage: string;
	start: Date;
	stop: Date;
}

const ALL_HEROES = "All Heroes";
const MATCH_TOTALS = "totals";

const DUMMY_TEAM: OWLTeam = {
	logo: "",
	name: "",
	players: {
			tanks: [""],
			dps: [""],
			supports: [""]
	},
	colors: {
			primary: "",
			secondary: "",
			tertiary: ""
	}
}

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
				<TableCell align="right">{stats["score"].toFixed(2)}</TableCell>
			</TableRow>
			<TableRow sx={{ bgcolor: colors.primary+"80" }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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

export default function PlayerStats() {
	let navigate = useNavigate();
	
	const goToPreviousPath = () => {
			navigate(-1)
	}

	const { player } = useParams();

	const [loading, setLoading] = useState(true);
	const [playerStats, setPlayerStats] = useState<PlayerStatistics>();
	const [currentStage, setCurrentStage] = useState("");
	const [team, setTeam] = useState<OWLTeam>(DUMMY_TEAM);
	const [role, setRole] = useState("");
	const [stages, setStages] = useState<string[]>([]);
	const [sortedMatches, setSortedMatches] = useState<(string | MatchStats)[][]>([]);
	
	useEffect(() => {
		player && Promise.all([
			fetchPlayerStats(player),
			fetchPlayerTeam(player),
			fetchWeeks()
		]).then(([stats, { team, role }, weeks]: [PlayerStatistics, TeamResp, Week[]]) => {
			if (stats && stats !== undefined) {
				setRole(role);
				setTeam(team);
				const stagesArray: string[] = [];
				stagesArray.push("All Matches");
				weeks.forEach(week => {
					if (!stagesArray.includes(week.stage)) {
						stagesArray.push(week.stage);
					}
				});
				setStages(stagesArray);
				setCurrentStage(stagesArray[0]);
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

  const stageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStage(event.target.value);
  };

	const displayPlayerAverages = (statKeys: string[]) => {
		return (
			<Container sx={{ display: "flex", flexDirection: "row" }}>
				{statKeys.map((statKey, i) => (
				<Container key={i} >
					<Typography color="#ffffff" variant="subtitle1">
						{ statKey }
					</Typography>
					<Typography color="#ffffff" variant="h4">
						{ playerStats && (playerStats.totals[statKey]/playerStats.totals['Time Played']*600).toFixed(4) }
					</Typography>
				</Container>
				))}
			</Container>
		)
	}
	
  return (
		<Box>
			<Button variant="text" color="secondary" onClick={goToPreviousPath}>
				{"< Back"}
			</Button>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Card sx={{ display: "flex", width: "fit-content", maxWidth: 900 }}>
					<Box sx={{ maxWidth: 210, background: team.colors.primary, flex: 1 }}>
						<CardContent sx={{ padding: "1!important" }}>
							<PersonIcon sx={{ fontSize: "11rem!important", color:"#ffffff" }} />
							<Typography color="#ffffff" variant="body1">
								{ team.name }
							</Typography>
							<Divider sx={{ background: team.colors.tertiary, opacity: 0.2, marginTop: 1, marginBottom: 1 }} />
							{role.match("tank") && <ShieldIcon
								fontSize="medium"
								sx={{ display: "inline", float: "left", color: team.colors.secondary }}
								/>}
							{role.match("dps") && <SportsMmaIcon
								fontSize="medium"
								sx={{ display: "inline", float: "left", color: team.colors.secondary }}
								/>}
							{role.match("support") && <LocalHospitalIcon
								fontSize="medium"
								sx={{ display: "inline", float: "left", color: team.colors.secondary }}
								/>}
							<Typography variant="subtitle1" color="#ffffff" sx={{ display: "inline", paddingLeft: 1 }} >
								{ player }
							</Typography>
						</CardContent>
					</Box>
					<Box display={{ xs: "none", md: "flex" }} sx={{ background: team.colors.primary+"99", textAlign: "center" }}>
						<CardContent>
							<Typography color="#ffffff" variant="h6">
								Averages Per 10 Minutes
							</Typography>
							<Divider sx={{ background: team.colors.tertiary, opacity: 0.2, marginTop: 2, marginBottom: 7 }} />
							{role.match("tank") && displayPlayerAverages(['Eliminations', 'Hero Damage Done', 'Deaths'])}
							{role.match("dps") && displayPlayerAverages(['Final Blows', 'Eliminations', 'Hero Damage Done'])}
							{role.match("support") && displayPlayerAverages(['Healing Done', 'Assists', 'Deaths'])}
						</CardContent>
					</Box>
				</Card>
			</Box>
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
										<TableCell align="right">{"Score"}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										sortedMatches.map((match, i) => {
											const matchStats = match[1] as MatchStats;
											return ((currentStage === "All Matches" || matchStats.stage === currentStage) &&
												<Row key={i} stats={matchStats} colors={team.colors} />
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
		</Box>
	);
}
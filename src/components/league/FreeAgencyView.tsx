import { Alert, Button, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, Grid, IconButton, InputLabel, Link, MenuItem, Modal, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerStatistics, WeeklyPlayerScores } from "../types";
import { Team } from "../types";
import { LeagueTeam } from "./types";
import { useSessionUser } from "../../hooks/useSessionUser";
import { fetchActivePlayers, fetchCurrentWeek, fetchLeagueTeams, fetchPickup, fetchPlayers, fetchTeams } from "../../service/fetches";

interface FormattedPlayerData {
  name: string;
  team: string;
  role: string;
  totals: {
    eliminations: number;
    deaths: number;
    damage: number;
    matches: number;
    assists: number;
    finalBlows: number;
    healing: number;
    timePlayed: number;
  }
  previousScore: number;
  averageScore: number;
  totalScore: number;
  isAvailable: boolean;
}

interface PlayerData {
  [playerName: string]: PlayerStatistics;
}

const FreeAgencyView = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const screenLargerThanSM = useMediaQuery(theme.breakpoints.up("md"));

	const [sessionUser] = useSessionUser();

	const [isModalOpen, setModalOpen] = useState(false);
	const [isModalProcessing, setModalProcessing] = useState(false);
	const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
	const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
	const [playerData, setPlayerData] = useState<FormattedPlayerData[]>();
	const [playerToAdd, setPlayerToAdd] = useState("");
	const [playerToDrop, setPlayerToDrop] = useState("");
	const [roleFilter, setRoleFilter] = useState("TANK/SUP/DPS");
	const [sessionUsersTeam, setSessionUsersTeam] = useState<LeagueTeam>();
	const [showFreeAgentsOnly, setShowFreeAgentsOnly] = useState(true);
	const [sortByValue, setSortByValue] = useState("totalScore");

	const setTeamAndRole = (player: FormattedPlayerData, teams: Team[]) => {
		teams.forEach(team => {
			if (team.players.dps.includes(player.name)) {
				player.role = "DPS";
				player.team = team.name;
				return;
			}
			if (team.players.tanks.includes(player.name)) {
				player.role = "TANK";
				player.team = team.name;
				return;
			}
			if (team.players.supports.includes(player.name)) {
				player.role = "SUP";
				player.team = team.name;
				return;
			}
		});
		if (!player.team) {
			player.team = "Free Agent";
		}
	};

	const setPreviousScore = (weekly_player_scores: WeeklyPlayerScores, currentWeek: number, player: FormattedPlayerData) => {
		if (currentWeek <= 1) {
			player.previousScore = 0;
			return;
		}
		const score = weekly_player_scores[currentWeek-1];
		player.previousScore = score === undefined ? 0 : score;
	};

	const setAverageScore = (weekly_player_scores: WeeklyPlayerScores, currentWeek: number, player: FormattedPlayerData) => {
		if (currentWeek <= 1) {
			player.averageScore = 0;
			return;
		}
		let sum = 0;
		let numScores = 0;
		for (let i = 1; i < currentWeek; i++) {
			const score = weekly_player_scores[i];
			if ((!score && score === undefined) || score === 0) {
				continue;
			}
			numScores++;
			sum += score;
		}
		if (sum === 0) {
			player.averageScore = 0;
		} else {
			player.averageScore = sum/numScores;
		}
	};

	const isPlayerFreeAgent = (name: string, leagueTeams: LeagueTeam[]) => {
		let isPlayerFA = true;
		leagueTeams.forEach(team => {
			if (team.players.tanks.includes(name)) {
				isPlayerFA = false;
			}
			if (team.players.dps.includes(name)) {
				isPlayerFA = false;
			}
			if (team.players.supports.includes(name)) {
				isPlayerFA = false;
			}
			if (team.players.flex.includes(name)) {
				isPlayerFA = false;
			}
			if (team.players.bench.includes(name)) {
				isPlayerFA = false;
			}
		});
		return isPlayerFA;
	};

	const initData = useCallback(() => {
		Promise.all([
			fetchCurrentWeek(),
			fetchPlayers(),
			fetchTeams(),
			fetchLeagueTeams(),
			fetchActivePlayers()
		])
			.then(([currWeek, players, teams, leagueTeams, rosteredPlayers]: [number, PlayerData, Team[], LeagueTeam[], string[]]) => {
				const formattedPlayerData: FormattedPlayerData[] = [];
				for (const playerName of rosteredPlayers){
					const playerData = players[playerName];
					const formattedPlayer: FormattedPlayerData = {} as FormattedPlayerData;
					formattedPlayer.name = playerName;
					if (playerData) {
						formattedPlayer.totals = {
							eliminations: playerData.totals["Eliminations"],
							deaths: playerData.totals["Deaths"],
							damage: playerData.totals["Hero Damage Done"],
							matches: playerData.totals["Total Matches"],
							assists: playerData.totals["Assists"],
							finalBlows: playerData.totals["Final Blows"],
							healing: playerData.totals["Healing Done"],
							timePlayed: playerData.totals["Time Played"]
						};
						setPreviousScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
						setAverageScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
						formattedPlayer.totalScore = playerData.total_player_score;
					}
					setTeamAndRole(formattedPlayer, teams);
					formattedPlayer.isAvailable = isPlayerFreeAgent(playerName, leagueTeams);
					leagueTeams.forEach(team => {
						if (team.owner === sessionUser) {
							setSessionUsersTeam(team);
						}
					});
					formattedPlayerData.push(formattedPlayer);
				}
				setPlayerData(formattedPlayerData);
			})
			.catch(err => console.log(err));
	}, [sessionUser]);

	useEffect(() => initData(), [initData]);

	const navigateToPlayerStats = (playerName: string) => {
		navigate("/player-stats/" + playerName);
	};
  
	const handleSortByChange = (event: SelectChangeEvent) => {
		setSortByValue(event.target.value as string);
	};

	const tabChange = (_event: React.SyntheticEvent, newValue: string) => {
		setRoleFilter(newValue);
	};

	const checkboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShowFreeAgentsOnly(event.target.checked);
	};

	const compare = (a: FormattedPlayerData, b: FormattedPlayerData) => {
		const property = sortByValue === "averageScore" ? "averageScore" : "totalScore";
		if (!a[property] || a[property] < b[property]){
			return 1;
		}
		if (!b[property] || a[property] > b[property]){
			return -1;
		}
		return 0;
	};

	const handlePlayerToDropChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPlayerToDrop((event.target as HTMLInputElement).value);
	};

	const handleModalOpen = (playerName: string) => {
		setPlayerToAdd(playerName);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setPlayerToAdd("");
		setPlayerToDrop("");
		setModalOpen(false);
	};

	const handlePlayerSwapApproved = () => {
		setModalProcessing(true);
		fetchPickup(sessionUser, playerToAdd, playerToDrop)
			.then(response => {
				setModalProcessing(false);
				if (response.ok) {
					setSuccessSnackbarOpen(true);
					handleModalClose();
					initData();
				} else {
					setErrorSnackbarOpen(true);
					handleModalClose();
				}
			});
	};

	const handleCloseErrorSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setErrorSnackbarOpen(false);
	};

	const handleCloseSuccessSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setSuccessSnackbarOpen(false);
	};

	return (
		<Container maxWidth={false}>
			<Button variant="text" color="secondary" onClick={() => navigate(-1)}>
				{"< Back"}
			</Button>
			{/* <Box>Change role text to icon</Box> */}
			<Typography variant="h2" align="center">Players</Typography>
			<Grid container sx={{ margin: ".5rem 0" }}>
				<Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center", m: "0.5rem auto" }}>
					<FormControlLabel
						label="Free Agents Only"
						control={
							<Checkbox
								color="secondary"
								checked={showFreeAgentsOnly}
								onChange={checkboxChange}
							/>
						}
						sx={{ maxWidth: "15rem" }}
					/>
				</Grid>
				<Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", m: "0.5rem auto" }}>
					<Paper sx={{ flexGrow: 1, maxWidth: "28rem", maxHeight: "3.07rem" }}>
						<Tabs
							value={roleFilter}
							onChange={tabChange}
							indicatorColor="secondary"
							textColor="secondary"
							centered
						>
							<Tab label="All Roles" value="TANK/SUP/DPS" />
							<Tab label="Tank" value="TANK" />
							<Tab label="DPS" value="DPS" />
							<Tab label="Support" value="SUP" />
						</Tabs>
					</Paper>
				</Grid>
				<Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center", m: "0.5rem auto" }}>
					<FormControl sx={{ flexGrow: 1, maxWidth: "15rem" }}>
						<InputLabel color="secondary">Sort By</InputLabel>
						<Select
							color="secondary"
							label="Sort By"
							value={sortByValue}
							onChange={handleSortByChange}
						>
							<MenuItem value={"averageScore"}>Average Points</MenuItem>
							<MenuItem value={"totalScore"}>Total Points</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<TableContainer component={Paper} sx={{ marginBottom: "1.5rem" }}>
				<Table sx={{ minWidth: 650 }} size="small">
					<TableHead sx={{ bgcolor: "#203547" }}>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Role</TableCell>
							{screenLargerThanSM && <TableCell>Team</TableCell>}
							<TableCell align="right">Average Points</TableCell>
							<TableCell align="right">Total Points</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{playerData && 
							playerData.filter(player => roleFilter.includes(player.role) && (player.isAvailable || !showFreeAgentsOnly))
								.sort(compare).map((player) => (
									<TableRow
										key={player.name}
										sx={{ "&:last-child td, &:last-child th": { border: 0 }, paddingBottom: "1rem" }}
									>
										{player.isAvailable && sessionUser ? 
											<TableCell>
												<Tooltip title="Add Player">
													<IconButton size="small" color="success" onClick={() => handleModalOpen(player.name)}>
														<AddBoxIcon />
													</IconButton>
												</Tooltip>
											</TableCell>
											: 
											<TableCell>
												<IconButton size="small" disabled>
													<AddBoxIcon />
												</IconButton>
											</TableCell>
										}
										<TableCell component="th" scope="row">
											<Link color="secondary" underline="hover" onClick={() => navigateToPlayerStats(player.name)} sx={{ cursor: "pointer" }}>
												{player.name}
											</Link>
										</TableCell>
										<TableCell>{player.role ? player.role : "--"}</TableCell>
										{screenLargerThanSM && <TableCell>{player.team}</TableCell>}
										<TableCell align="right">{player.averageScore ? player.averageScore.toFixed(2) : "-"}</TableCell>
										<TableCell align="right">{player.totalScore ? player.totalScore.toFixed(2) : "-"}</TableCell>
									</TableRow>
								))}
					</TableBody>
				</Table>
			</TableContainer>
			<Modal
				open={isModalOpen}
				onClose={handleModalClose}
			>
				<Box sx={{
					position: "absolute" as const,
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 500,
					bgcolor: "background.paper",
					border: "1px solid #000",
					borderRadius: "0.5rem",
					boxShadow: 24,
					p: 3,
				}}>
					{isModalProcessing ?
						<Box sx={{ m: "10rem 0", display: "flex", justifyContent: "center" }} >
							<CircularProgress disableShrink size={150} color="secondary"/>
						</Box>
						:
						<React.Fragment>
							<Typography variant="h6" component="h2" sx={{ mb: ".5rem" }}>
								{"Select the player to drop for " + playerToAdd + ":"}
							</Typography>
							<FormControl component="fieldset">
								<RadioGroup
									value={playerToDrop}
									onChange={handlePlayerToDropChange}
								>
									{sessionUsersTeam && 
								[
									...sessionUsersTeam.players.tanks,
									...sessionUsersTeam.players.dps,
									...sessionUsersTeam.players.supports,
									...sessionUsersTeam.players.flex,
									...sessionUsersTeam.players.bench
								].map(player => {
									return <FormControlLabel key={player} value={player} control={<Radio color="secondary" />} label={player} />;
								})}
								</RadioGroup>
							</FormControl>
							{playerToDrop !== "" && <Alert variant="outlined" severity="info" sx={{ mt: 2 }}>
								{playerToAdd + " will be added to your bench. Make sure to adjust your roster if you wish to play him."}
							</Alert>}
							<Box sx={{ display: "flex", justifyContent: "center", mt: "1.5rem" }}>
								<Button disabled={playerToDrop === ""} variant="contained" color="primary" onClick={handlePlayerSwapApproved} sx={{ m: "0rem .5rem" }}>Approve</Button>
								<Button variant="contained" color="secondary" onClick={handleModalClose} sx={{ m: "0rem .5rem" }}>Cancel</Button>
							</Box>
						</React.Fragment>
					}
				</Box>
			</Modal>
			<Snackbar 
				anchorOrigin={{ vertical: "top", horizontal: "right" }} 
				open={errorSnackbarOpen} 
				autoHideDuration={6000} 
				onClose={handleCloseErrorSnackbar}
			>
				<Alert variant="filled" onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: "100%" }}>
          Something went wrong with your pickup.
				</Alert>
			</Snackbar>
			<Snackbar 
				anchorOrigin={{ vertical: "top", horizontal: "right" }} 
				open={successSnackbarOpen} 
				autoHideDuration={6000} 
				onClose={handleCloseSuccessSnackbar}
			>
				<Alert variant="filled" onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: "100%" }}>
          Your pickup was successful!
				</Alert>
			</Snackbar>
		</Container>
	);
}; 

export default FreeAgencyView;

import React, { ElementType, useEffect, useState } from "react";
import {
	Container,
	Button,
	Paper,
	Typography,
	ListItemButton,
	Box,
	ListItemText,
	Avatar,
	Chip,
	Grid,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { LeagueTeam } from "./types";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ChairIcon from "@mui/icons-material/Chair";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { PlayerStatistics, Team } from "../types";
import { fetchPlayers, fetchRoster, fetchRosterHistoric, fetchTeams } from "../../service/fetches";

interface PlayerData {
  [playerName: string]: PlayerStatistics;
}

const LeagueMatchupView = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const screenLargerThanXS = useMediaQuery(theme.breakpoints.up("sm"));
	const location = useLocation();
	const [homeTeam, setHomeTeam] = useState<LeagueTeam>();
	const [awayTeam, setAwayTeam] = useState<LeagueTeam>();
	const [owlTeams, setOWLTeams] = useState<Team[]>();
	const [playerData, setPlayerData] = useState<PlayerData>();
	const [homeTeamScore, setHomeTeamScore] = useState(0);
	const [awayTeamScore, setAwayTeamScore] = useState(0);

	const { home, away, weekNumber, isPastMatch } = location.state as {
    home: string, away: string, weekNumber: number, isPastMatch: boolean
  };

	useEffect(() => {
		if (isPastMatch) {
			Promise.all([
				fetchRosterHistoric(home, weekNumber),
				fetchRosterHistoric(away, weekNumber),
				fetchTeams(),
				fetchPlayers()
			])
				.then(([homeTeamResp, awayTeamResp, owlTeamsResp, playerDataResp]: [LeagueTeam, LeagueTeam, Team[], PlayerData]) => {
					setHomeTeam(homeTeamResp);
					setAwayTeam(awayTeamResp);
					setOWLTeams(owlTeamsResp);
					setPlayerData(playerDataResp);
					const homeStarters = [
						...homeTeamResp.players.tanks,
						...homeTeamResp.players.dps,
						...homeTeamResp.players.supports,
						...homeTeamResp.players.flex
					];
					const awayStarters = [
						...awayTeamResp.players.tanks,
						...awayTeamResp.players.dps,
						...awayTeamResp.players.supports,
						...awayTeamResp.players.flex
					];
					let homeScore = 0;
					homeStarters.forEach(player => {
						if (playerDataResp) {
							homeScore += playerDataResp[player].weekly_player_scores[weekNumber];
						}
					});
					setHomeTeamScore(homeScore);
					let awayScore = 0;
					awayStarters.forEach(player => {
						if (playerDataResp) {
							awayScore += playerDataResp[player].weekly_player_scores[weekNumber];
						}
					});
					setAwayTeamScore(awayScore);
				})
				.catch(err => console.log(err));
		} else {
			Promise.all([
				fetchRoster(home),
				fetchRoster(away),
				fetchTeams()
			])
				.then(([homeTeamResp, awayTeamResp, owlTeamsResp]: [LeagueTeam, LeagueTeam, Team[]]) => {
					setHomeTeam(homeTeamResp);
					setAwayTeam(awayTeamResp);
					setOWLTeams(owlTeamsResp);
				})
				.catch(err => console.log(err));
		}
	}, [home, away, isPastMatch, weekNumber]);

	const navigateToPlayerStats = (playerName: string) => {
		navigate("/player-stats/" + playerName);
	};

	const getTeamAbbr = (playerName: string) => {
		let teamAbbr = "-";
		owlTeams?.forEach(team => {
			const players = [
				...team.players.tanks,
				...team.players.dps,
				...team.players.supports
			];
			if (players.includes(playerName)) {
				teamAbbr = team.abbr;
			}
		});
		return teamAbbr;
	};

	const displayPlayers = (
		homePlayers: string[],
		awayPlayers: string[],
		role: string,
		AvatarIcon: ElementType,
		avatarColor: string,
		numToDisplay: number
	) => {
		const playerArray: JSX.Element[] = [];
		for (let i = 0; i < numToDisplay; i++) {
			const homePlayer = homePlayers[i];
			const awayPlayer = awayPlayers[i];
			playerArray.push(
				<Paper key={i} elevation={3} sx={{ mb: ".5rem", mt: ".5rem" }}>
					<Grid container alignItems="center">
						{screenLargerThanXS && 
							<Grid item xs={1}>
								<AvatarIcon sx={{ color: avatarColor, fontSize: 30 }}/>
							</Grid>
						}
						<Grid item xs={4} sm={3}>
							<ListItemButton
								disabled={!homePlayer}
								key={i}
								onClick={() => homePlayer && navigateToPlayerStats(homePlayer)}
								sx={{ pt: "0.1rem", pb: "0.1rem" }}
							>
								<ListItemText
									primary={homePlayer}
									secondary={homePlayer ? getTeamAbbr(homePlayer) : "-"}
								/>
							</ListItemButton>
						</Grid>
						{screenLargerThanXS ?
							<React.Fragment>
								<Grid item xs={1} sm={1}>
									<Chip
										label={playerData && homePlayer ? playerData[homePlayer].weekly_player_scores[weekNumber].toFixed(2) : "0.00"}
										sx={{ width: "4.5rem" }}
									/>
								</Grid>
								<Grid item xs={2} sm={2}>
									<Avatar
										variant="rounded"
										sx={{
											fontSize: ".9rem",
											fontWeight: "500",
											height: "2rem",
											width: "3.5rem",
											color: avatarColor,
											bgcolor: "#333344",
											margin: "auto"
										}}
									>
										{role}
									</Avatar>
								</Grid>
								<Grid item xs={1} sm={1}>
									<Chip
										label={playerData && awayPlayer ? playerData[awayPlayer].weekly_player_scores[weekNumber].toFixed(2) : "0.00"}
										sx={{ width: "4.5rem" }}
									/>
								</Grid>
							</React.Fragment>
							:
							<Grid item xs={4}>
								<Box>
									<Typography sx={{ color: avatarColor }} >{role}</Typography>
									<Typography variant="body2">
										{playerData && homePlayer ? playerData[homePlayer].weekly_player_scores[weekNumber].toFixed(2) : "0.00"}
                  &nbsp;-&nbsp;
										{playerData && awayPlayer ? playerData[awayPlayer].weekly_player_scores[weekNumber].toFixed(2) : "0.00"}
									</Typography>
								</Box>
              
							</Grid>
						}
						<Grid item xs={4} sm={3}>
							<ListItemButton
								disabled={!awayPlayer}
								key={i}
								onClick={() => awayPlayer && navigateToPlayerStats(awayPlayer)}
								sx={{ pt: "0.1rem", pb: "0.1rem", textAlign: "right" }}
							>
								<ListItemText
									primary={awayPlayer}
									secondary={awayPlayer ? getTeamAbbr(awayPlayer) : "-"}
								/>
							</ListItemButton>
						</Grid>
						{screenLargerThanXS && 
							<Grid item xs={1}>
								<AvatarIcon sx={{ color: avatarColor, fontSize: 30 }}/>
							</Grid>
						}
					</Grid>
				</Paper>
			);
		}
		return playerArray;
	};

	const displayTeams = (homeTeam: LeagueTeam, awayTeam: LeagueTeam) => {
		return (
			<Box sx={{ width: "60rem" }}>
				<Paper elevation={3}>
					<Grid container alignItems="center" sx={{ height: "6rem" }}>
						<Grid item xs={4}>
							{screenLargerThanXS ?
								<Box>
									<Typography variant="h5">{homeTeam.name}</Typography>
									<Typography variant="subtitle1" color="text.secondary">{homeTeam.ownerName}</Typography>
								</Box>
								:
								<Box>
									<Typography variant="subtitle1">{homeTeam.name}</Typography>
								</Box>
							}
						</Grid>
						{screenLargerThanXS ?
							<React.Fragment>
								<Grid item xs={1}>
									<Chip label={homeTeamScore.toFixed(2)} sx={{ width: "4.5rem" }} />
								</Grid>
								<Grid item xs={2}>
									<Typography>VS</Typography>
								</Grid>
								<Grid item xs={1}>
									<Chip label={awayTeamScore.toFixed(2)} sx={{ width: "4.5rem" }} />
								</Grid>
							</React.Fragment>
							:
							<Grid item xs={4}>
								<Typography variant="body2">
									{homeTeamScore.toFixed(2)}
                &nbsp;-&nbsp;
									{awayTeamScore.toFixed(2)}
								</Typography>
							</Grid>
						}
						<Grid item xs={4}>
							{screenLargerThanXS ?
								<Box>
									<Typography variant="h5">{awayTeam.name}</Typography>
									<Typography variant="subtitle1" color="text.secondary">{awayTeam.ownerName}</Typography>
								</Box>
								:
								<Box>
									<Typography variant="subtitle1">{awayTeam.name}</Typography>
								</Box>
							}
						</Grid>
					</Grid>
				</Paper>
				<Typography sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem", pt: "0.5rem", fontWeight: "500" }}>
          Starters
				</Typography>
				{displayPlayers(homeTeam.players.tanks, awayTeam.players.tanks, "TANK", ShieldIcon, "#3555a3", 1)}
				{displayPlayers(homeTeam.players.dps, awayTeam.players.dps, "DPS", SportsMmaIcon, "#a55553", 2)}
				{displayPlayers(homeTeam.players.supports, awayTeam.players.supports, "SUP", LocalHospitalIcon, "#55a553", 2)}
				{displayPlayers(homeTeam.players.flex, awayTeam.players.flex, "FLEX", AutorenewIcon, "#754593", 1)}
				<Typography sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem", fontWeight: "500" }}>
          Bench
				</Typography>
				{displayPlayers(
					homeTeam.players.bench,
					awayTeam.players.bench,
					"BN",
					ChairIcon,
					"#666666",
					homeTeam.players.bench.length > awayTeam.players.bench.length ? homeTeam.players.bench.length : awayTeam.players.bench.length
				)}
			</Box>
		);
	};

	return (
		<Container>
			<Button variant="text" color="secondary" onClick={() => navigate(-1)}>
				{"< Back"}
			</Button>
			<Box sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
				{homeTeam && awayTeam && displayTeams(homeTeam, awayTeam)}
			</Box>
		</Container>
	);
};

export default LeagueMatchupView;
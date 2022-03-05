import React, { useEffect, useState } from "react";
import {
	Container,
	Button,
	Card,
	Typography,
	Box,
	ListItemButton,
	ListItemText,
	Grid, 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LeagueTeam, ScheduleWeek } from "./types";
import { fetchCurrentWeek, fetchSchedule, fetchTeams } from "../../service/fetches";

const ScheduleView = () => {
	const navigate = useNavigate();
	const [schedule, setSchedule] = useState<ScheduleWeek[]>();
	const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>();
	const [currentWeek, setCurrentWeek] = useState(0);

	useEffect(() => {
		Promise.all([fetchCurrentWeek(), fetchSchedule(), fetchTeams()])
			.then(([currWeek, scheduleResp, leagueTeamsResp]: [number, ScheduleWeek[], LeagueTeam[]]) => {
				setSchedule(scheduleResp);
				setLeagueTeams(leagueTeamsResp);
				setCurrentWeek(currWeek);
			})
			.catch(err => console.log(err));
	}, []);

	const navigateToMatchup = (homeTeam: string, awayTeam: string, weekNumber: number) => {
		navigate("/league/matchup", { state: {home: homeTeam, away: awayTeam, weekNumber, isPastMatch: weekNumber < currentWeek} });
	};

	const getBGColor = (week: number) => {
		if (week === currentWeek) {
			return "#2a4f2c";
		}
		return week < currentWeek ? "#354f5a" : "background.paper";
	};

	return (
		<Container>
			<Button variant="text" color="secondary" onClick={() => navigate(-1)}>
				{"< Back"}
			</Button>
			<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{schedule?.map((week, key) => {
					return (
						<Box sx={{ float: "left", margin: ".75rem", textAlign: "center", minWidth: "28rem" }} key={key}>
							<Typography>{"Week " + week.week}</Typography>
							<Card key={key} sx={{ bgcolor: getBGColor(+week.week) }} >
								{week.matches.map((match, key) => {
									return (
										<ListItemButton
											key={key}
											onClick={() => navigateToMatchup(match[0], match[1], +week.week)}
											sx={{ pt: "0.5rem", pb: "0.5rem", textAlign:"center" }}
										>
											<Grid container alignItems="center">
												<Grid item xs={5}>
													<ListItemText
														primary={match[0]}
														secondary={leagueTeams ? leagueTeams.find(team => team.owner === match[0])?.name : "-"}
													/>
												</Grid>
												<Grid item xs={2}>
													<Typography>{"vs."}</Typography>
												</Grid>
												<Grid item xs={5}>
													<ListItemText
														primary={match[1]}
														secondary={leagueTeams ? leagueTeams.find(team => team.owner === match[1])?.name : "-"}
													/>
												</Grid>
											</Grid>
										</ListItemButton>
									);
								})}
							</Card>
						</Box>
					);
				})}
			</Box>
		</Container>
	);
};

export default ScheduleView;
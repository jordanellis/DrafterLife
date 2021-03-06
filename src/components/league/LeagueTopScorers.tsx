import React, { useEffect, useState } from "react";
import { Box, Container, List, ListItem, ListItemButton, Skeleton, Typography } from "@mui/material";
import { PlayerStatistics } from "../types";
import { fetchActivePlayers, fetchCurrentWeek, fetchPlayers } from "../../service/fetches";
import { useNavigate } from "react-router-dom";

interface PlayerData {
  [playerName: string]: PlayerStatistics;
}

export default function LeagueTopScorers() {
	const navigate = useNavigate();
	const [topPlayers, setTopPlayers] = useState<Array<Array<string|number>>>();

	useEffect(() => {
		Promise.all([
			fetchCurrentWeek(),
			fetchPlayers(),
			fetchActivePlayers()
		])
			.then(([weekNum, players, activePlayers]: [number, PlayerData, string[]]) => {
				const playerData = Object.keys(players);
				const sortedPlayers = playerData.filter(x => activePlayers.includes(x))
					.map(player => [player, players[player].weekly_player_scores[weekNum-1]])
					.sort((a, b) => a[1] < b[1] ? 1 : -1);
				setTopPlayers(sortedPlayers.slice(0, 10));
			})
			.catch(err => console.log(err));
	}, []);

	return (
		<Container maxWidth='xs' disableGutters sx={{ textAlign: "center", mb: "2rem" }}>
			<Typography variant='subtitle2' sx={{ margin: "0.8rem 0", fontWeight: "500", opacity: "70%" }}>
				{"Last Week's Top Scorers:"}
			</Typography>
			<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
				<List>
					{topPlayers ? 
						topPlayers.map((player, i) => (
							<ListItem key={i} disablePadding>
								<ListItemButton sx={{ display: "flex" }} onClick={() => navigate("/player-stats/" + player[0])}>
									<Typography sx={{ width: "4.4rem" }}>{i+1 + "."}</Typography>
									<Typography sx={{ width: "8rem" }}>{player[0]}</Typography>
									<Typography sx={{ textAlign: "right", width: "100%" }}>
										{player[1] ? (typeof player[1] === "number" ? player[1].toFixed(2) : parseInt(player[1]).toFixed(2)) : "-"}
									</Typography>
								</ListItemButton>
							</ListItem>
						))
						:
						<Skeleton variant="rectangular" sx={{ width: "content-fit", height: "25rem" }}></Skeleton>
					}
				</List>
			</Box>
		</Container>
	);
}


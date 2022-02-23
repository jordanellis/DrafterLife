import React, { useEffect, useState } from "react";
import { Box, Container, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { PlayerStatistics } from "../types";
import { fetchCurrentWeek, fetchPlayers } from "../../service/fetches";

interface PlayerData {
  [playerName: string]: PlayerStatistics;
}

export default function LeagueTopScorers() {
  const [topPlayers, setTopPlayers] = useState<Array<Array<string|number>>>();

  useEffect(() => {
    Promise.all([
			fetchCurrentWeek(),
			fetchPlayers()
		])
			.then(([weekNum, players]: [number, PlayerData]) => {
        const sortedPlayers = Object.keys(players)
          .map(player => [player, players[player].weekly_player_scores[weekNum-1]])
          .sort((a, b) => a[1] < b[1] ? 1 : -1);
        setTopPlayers(sortedPlayers.slice(0, 10));
      })
			.catch(err => console.log(err))
  }, []);

  return (
    <Container maxWidth="xs" disableGutters sx={{ textAlign: "center" }}>
      <Typography variant="subtitle2" sx={{ margin: "0.8rem 0", fontWeight: "500", opacity: "70%" }}>
        Last Week's Top Scorers:
      </Typography>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <List>
          {topPlayers?.map((player, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton sx={{ display: "flex" }}>
                <Typography sx={{ width: "4.4rem" }}>{i+1 + "."}</Typography>
                <Typography sx={{ width: "12rem" }}>{player[0]}</Typography>
                <Typography sx={{ textAlign: "right", width: "100%" }}>
                  {typeof player[1] === "number" ? player[1].toFixed(2) : parseInt(player[1]).toFixed(2)}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}


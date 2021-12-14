import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerStatistics } from "../types";
import { Team } from "../types";

type FormattedPlayerData = {
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
  isAvailable: boolean;
}

type PlayerData = {
  [playerName: string]: PlayerStatistics;
}

const FreeAgencyView = () => {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState<FormattedPlayerData[]>();

	useEffect(() => {
    Promise.all([
      fetchPlayers(),
			fetchTeams()
		])
      .then(([players, teams]: [PlayerData, Team[]]) => {
        const formattedData = formatPlayerData(players, teams);
        setPlayerData(formattedData);
      })
			.catch(err => console.log(err))
	}, []);

	const fetchPlayers = async () => {
    const response = await fetch('/api/player-stats');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.data;
  };

	const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  const formatPlayerData = (players: PlayerData, teams: Team[]) => {
    const formattedPlayerData: FormattedPlayerData[] = [];
    for (let playerName of Object.keys(players)){
      const playerData = players[playerName];
      let formattedPlayer: FormattedPlayerData = {} as FormattedPlayerData;
      formattedPlayer.name = playerName;
      formattedPlayer.team = "";
      formattedPlayer.role = "";
      formattedPlayer.totals = {
        eliminations: playerData.totals["Eliminations"],
        deaths: playerData.totals["Deaths"],
        damage: playerData.totals["Hero Damage Done"],
        matches: playerData.totals["Total Matches"],
        assists: playerData.totals["Assists"],
        finalBlows: playerData.totals["Final Blows"],
        healing: playerData.totals["Healing Done"],
        timePlayed: playerData.totals["Time Played"]
      }
      formattedPlayer.previousScore = 1;
      formattedPlayer.averageScore = 1;
      formattedPlayer.isAvailable = true;
      playerName === "COLOURHEX" && console.log(formattedPlayer);
      formattedPlayerData.push(formattedPlayer);
    }
    return formattedPlayerData;
  }

  // Fetch All players, fetch all league teams' players
  // add to players object whether or not they're on a team

  return (
    <Container maxWidth={false}>
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
				{"< Back"}
			</Button>
      <Box>Checkbox to view all players, not just FAs</Box>
      <Box>Slider toggle to view players by role (tank, dps, support)</Box>
      <Box>List of FAs/players</Box>
      <Typography variant="h2" align="center">Players</Typography>
      {playerData && playerData.map((player, index) => (
        <Typography key={index}>{player.name}</Typography>
      ))}
    </Container>
  );
}

export default FreeAgencyView
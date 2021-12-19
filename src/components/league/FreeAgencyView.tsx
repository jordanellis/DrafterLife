import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerStatistics, WeeklyPlayerScores } from "../types";
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

  const setTeamAndRole = (player: FormattedPlayerData, teams: Team[]) => {
    teams.forEach(team => {
      if (team.players.dps.includes(player.name)) {
        player.role = "dps";
        player.team = team.name;
        return;
      }
      if (team.players.tanks.includes(player.name)) {
        player.role = "tank";
        player.team = team.name;
        return;
      }
      if (team.players.supports.includes(player.name)) {
        player.role = "support";
        player.team = team.name;
        return;
      }
    });
  }

  const setPreviousScore = (weekly_player_scores: WeeklyPlayerScores, currentWeek: number, player: FormattedPlayerData) => {
    if (currentWeek <= 1) {
      player.previousScore = 0;
      return;
    }
    const score = weekly_player_scores[currentWeek-1];
    player.previousScore = score === undefined ? 0 : score;
  }

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
    player.averageScore = sum/numScores;
  }

	useEffect(() => {
    Promise.all([
      fetchCurrentWeek(),
      fetchPlayers(),
			fetchTeams()
		])
      .then(([currWeek, players, teams]: [number, PlayerData, Team[]]) => {
        const formattedPlayerData: FormattedPlayerData[] = [];
        for (let playerName of Object.keys(players)){
          const playerData = players[playerName];
          let formattedPlayer: FormattedPlayerData = {} as FormattedPlayerData;
          formattedPlayer.name = playerName;
          setTeamAndRole(formattedPlayer, teams);
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
          setPreviousScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
          setAverageScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
          formattedPlayer.isAvailable = true;
          playerName === "DOHA" && console.log(formattedPlayer);
          formattedPlayerData.push(formattedPlayer);
        }
        setPlayerData(formattedPlayerData);
      })
			.catch(err => console.log(err))
	}, []);

  const fetchCurrentWeek = async () => {
    const response = await fetch('/api/league/currentWeek');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.weekNumber;
  };

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
    return body.data;
  };

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

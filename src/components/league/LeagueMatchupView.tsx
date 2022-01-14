import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Paper,
  Typography,
  ListItemButton,
  List,
  ListSubheader,
  Box,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { LeagueTeam } from "./types";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ChairIcon from '@mui/icons-material/Chair';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';

const LeagueMatchupView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [homeTeam, setHomeTeam] = useState<LeagueTeam>();
  const [awayTeam, setAwayTeam] = useState<LeagueTeam>();

  const { home, away } = location.state as {home: string, away: string};

  useEffect(() => {
    Promise.all([
      fetchRoster(home),
      fetchRoster(away)
    ])
    .then(([homeTeamResp, awayTeamResp]: [LeagueTeam, LeagueTeam]) => {
      setHomeTeam(homeTeamResp);
      setAwayTeam(awayTeamResp);
    })
    .catch(err => console.log(err))
  }, [home, away]);

	const fetchRoster = async (ownerName: string) => {
    const response = await fetch('/api/league/team/'+ownerName);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.team;
  };

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName);
  }

  const displayPlayers = (players: string[], avatarIcon: React.ReactElement, avatarColor: string, numToDisplay = -1) => {
    let playerArray = players.map((player, index) => {
      return (
        <ListItemButton key={index} onClick={() => navigateToPlayerStats(player)} sx={{ pt: "0.1rem", pb: "0.1rem" }}>
          <ListItemAvatar sx={{ mr: "1.5rem" }}>
            <Avatar variant="rounded" sx={{ color: avatarColor, bgcolor: "#333344" }}>
              {avatarIcon}
            </Avatar>
          </ListItemAvatar>
          <Container sx={{ display: "flex", justifyContent: "stretch", alignItems: "center" }}>
            <ListItemText
              primary={player}
              secondary={"VS -"}
            />
            <Chip label="0.00" />
          </Container>
        </ListItemButton>
      );
    });
    for (let i = playerArray.length; i < numToDisplay; i++) {
      playerArray.push((
        <ListItemButton key={i} sx={{ pt: "0.1rem", pb: "0.1rem" }}>
          <ListItemAvatar sx={{ mr: "1.5rem" }}>
            <Avatar variant="rounded" sx={{ color: avatarColor, bgcolor: "#333344" }}>
              {avatarIcon}
            </Avatar>
          </ListItemAvatar>
          <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <ListItemText secondary="-" />
            <Chip label="0.00" />
          </Container>
        </ListItemButton>
      ));
    }
    return playerArray;
  }

  const displayTeam = (team: LeagueTeam) => {
    return (
      <Container>
        <Paper elevation={3}>
          <Typography variant="h5">{team.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{team.ownerName}</Typography>
        </Paper>
        <Paper elevation={3}>
          <List
            subheader={
              <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                Starters
              </ListSubheader>
            }
          >
            {displayPlayers(team.players.tanks, <ShieldIcon/>, "#3555a3", 1)}
            {displayPlayers(team.players.dps, <SportsMmaIcon/>, "#a55553", 2)}
            {displayPlayers(team.players.supports, <LocalHospitalIcon/>, "#55a553", 2)}
            {displayPlayers(team.players.flex, <AutorenewIcon/>, "#754593", 1)}
          </List>
          <List
            subheader={
              <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                Bench
              </ListSubheader>
            }
          >
            {displayPlayers(team.players.bench, <ChairIcon/>, "#666666")}
          </List>
        </Paper>
      </Container>
    );
  }

	return (
    <Container>
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        {"< Back"}
      </Button>
      <Container sx={{ textAlign: "center" }}>
        <Container sx={{ display: "flex", justifyContent: "space-evenly" }}>
          {homeTeam && displayTeam(homeTeam)}
          <Typography sx={{ mt: "17rem" }}>VS</Typography>
          {awayTeam && displayTeam(awayTeam)}
        </Container>
      </Container>
    </Container>
    );
}

export default LeagueMatchupView
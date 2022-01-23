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

  const displayPlayers = (homePlayers: string[], awayPlayers: string[], role: string, AvatarIcon: ElementType, avatarColor: string, numToDisplay: number) => {
    let playerArray: JSX.Element[] = [];
    for (let i = 0; i < numToDisplay; i++) {
      const homePlayer = homePlayers[i];
      const awayPlayer = awayPlayers[i];
      playerArray.push(
        <Paper elevation={3} sx={{ mb: ".5rem", mt: ".5rem" }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <AvatarIcon sx={{ color: avatarColor, fontSize: 30 }}/>
            </Grid>
            <Grid item xs={3}>
              <ListItemButton key={i} onClick={() => homePlayer && navigateToPlayerStats(homePlayer)} sx={{ pt: "0.1rem", pb: "0.1rem" }}>
                <ListItemText
                  primary={homePlayer}
                  secondary={homePlayer ? "VS -" : "-"}
                />
              </ListItemButton>
            </Grid>
            <Grid item xs={1}>
              <Chip label="0.00" />
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={1}>
              <Chip label="0.00" />
            </Grid>
            <Grid item xs={3}>
              <ListItemButton key={i} onClick={() => awayPlayer && navigateToPlayerStats(awayPlayer)} sx={{ pt: "0.1rem", pb: "0.1rem", textAlign: "right" }}>
                <ListItemText
                  primary={awayPlayer}
                  secondary={awayPlayer ? "VS -" : "-"}
                />
              </ListItemButton>
            </Grid>
            <Grid item xs={1}>
              <AvatarIcon sx={{ color: avatarColor, fontSize: 30 }}/>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    return playerArray;
  }

  const displayTeams = (homeTeam: LeagueTeam, awayTeam: LeagueTeam) => {
    return (
      <Container sx={{ maxWidth: "50rem" }}>
        <Paper elevation={3}>
          <Grid container alignItems="center" sx={{ height: "6rem" }}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5">{homeTeam.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{homeTeam.ownerName}</Typography>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Chip label="0.00" />
            </Grid>
            <Grid item xs={2}>
              <Typography>VS</Typography>
            </Grid>
            <Grid item xs={1}>
              <Chip label="0.00" />
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="h5">{awayTeam.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{awayTeam.ownerName}</Typography>
              </Box>
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
          {homeTeam && awayTeam && displayTeams(homeTeam, awayTeam)}
        </Container>
      </Container>
    </Container>
    );
}

export default LeagueMatchupView
import React, { useEffect, useState } from "react";
import { 
  AppBar, Avatar, Button, Container, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Paper, Skeleton, Typography, 
} from '@mui/material';
import { Players, LeagueTeam } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import ChairIcon from '@mui/icons-material/Chair';
import { PlayerStatistics, Team } from "../types";

type TeamsResp = {
  team: LeagueTeam;
}

type RosterStatsResp = {
  [player: string]: PlayerStatistics;
}

type PlayerInfo = {
  team: string;
  role: string;
}

const TeamView = () => {
  const navigate = useNavigate();
	const { ownerName } = useParams();
  const [team, setTeam] = useState<LeagueTeam>();
  const [rosterStats, setRosterStats] = useState<RosterStatsResp>();
  const [playerInfo, setPlayerInfo] = useState<Map<string, PlayerInfo>>();

	useEffect(() => {
    ownerName && fetchRoster(ownerName)
			.then((resp: TeamsResp) => {
        setTeam(resp.team)
      })
			.catch(err => console.log(err))
	}, [ownerName]);

	useEffect(() => {
    if (team && team !== undefined) {
      Promise.all([
        fetchRosterStats(team.players),
        fetchTeams()
      ])
        .then(([resp, teamsResp]: [RosterStatsResp, Team[]]) => {
          console.log(resp)
          setRosterStats(resp);
          const allPlayers = [
            ...team.players.tanks,
            ...team.players.dps,
            ...team.players.supports,
            ...team.players.flex,
            ...team.players.bench
          ];
          let playerInfoMap = new Map<string, PlayerInfo>();
          teamsResp.forEach(teamResp => {
            teamResp.players.tanks.forEach(tank => {
              if (allPlayers.includes(tank)) {
                playerInfoMap.set(tank, {team: teamResp.name, role: "tank"});
              }
            });
            teamResp.players.dps.forEach(dps => {
              playerInfoMap.set(dps, {team: teamResp.name, role: "dps"});
            });
            teamResp.players.supports.forEach(support => {
              playerInfoMap.set(support, {team: teamResp.name, role: "support"});
            });
          });
          setPlayerInfo(playerInfoMap);
        })
        .catch(err => console.log(err))
    }
	}, [team]);

	const fetchRoster = async (ownerName: string) => {
    const response = await fetch('/api/league/team/'+ownerName);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	const fetchRosterStats = async (p: Players) => {
    const players = p.tanks.concat(p.dps, p.supports, p.flex, p.bench);
    const response = await fetch('/api/player-stats', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({players})
    });
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

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName);
  }

  const displayPlayers = (players: string[], icon: JSX.Element = <React.Fragment/>, numToDisplay: number = -1) => {
    let playerArray = players.map((player, index) => {
      return (<ListItemButton key={index} onClick={() => navigateToPlayerStats(player)} sx={{ pt: "0.25rem", pb: "0.25rem" }}>
            <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "18rem" }}>
                <ListItemAvatar><Avatar sx={{ bgcolor: "#55a5a3" }}>{icon}</Avatar></ListItemAvatar>
                <ListItemText
                  primary={player}
                  secondary={playerInfo?.get(player)?.team ?? "-"}
                />
              </Box>
              {rosterStats &&
                <ListItemText
                  primary={<Typography variant="body2">Next Opponent:</Typography>}
                  secondary={"-"}
                />
              }
              {rosterStats &&
                <ListItemText
                  primary={<Typography variant="body2">Avg Score:</Typography>}
                  secondary={(rosterStats[player].total_player_score/rosterStats[player].totals["Total Matches"]).toFixed(3)}
                />
              }
            </Container>
        </ListItemButton>
      );
    });
    for (let i = playerArray.length; i < numToDisplay; i++) {
      playerArray.push((<ListItemButton sx={{ pt: "0.25rem", pb: "0.25rem" }}>
        <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "18rem" }}>
            <ListItemAvatar><Avatar sx={{ bgcolor: "#55a5a3" }}>{icon}</Avatar></ListItemAvatar>
            <ListItemText primary="-" sx={{ height: "2.75rem" }} />
          </Box>
          <ListItemText secondary="-" sx={{ width: "3rem" }} />
          <ListItemText secondary="-" />
        </Container>
        </ListItemButton>
      ));
    }
    return playerArray;
  }

	return (
    <Box>
    {team && playerInfo ? 
      <Box>
        <AppBar position="static" sx={{ backgroundColor: "primary.dark", padding: "1rem" }}>
					<Box sx={{ width: "85%", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Container sx={{ margin: "unset", width: "unset", textAlign: "center" }}>
                <PersonIcon sx={{ fontSize: "11rem!important" }} />
              </Container>
              <Container sx={{ margin: "unset", width: "unset" }}>
                <Typography variant="h5">{team.name}</Typography>
                <Typography variant="h6" sx={{ paddingBottom: "1.5rem" }}>{team.wins + "-" + team.losses}</Typography>
                <Typography variant="body2" sx={{ opacity: "0.75" }}>{<span><b>Bio: </b>{team.bio}</span>}</Typography>
              </Container>
            </Box>
            <Typography variant="h6">{team.ownerName}</Typography>
            <Typography variant="body2" sx={{ opacity: "0.75" }}>
              {<span><b>Team Motto: </b>{"\"" + team.quote + "\""}</span>}
            </Typography>
          </Box>
        </AppBar>
        <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
          {"< Back"}
        </Button>
        <Container maxWidth="md" sx={{ marginTop: "1rem" }}>
          {"add ability to move players around"}
          <Paper elevation={3}>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                  Roster
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.tanks, <ShieldIcon/>, 1)}
              {displayPlayers(team.players.dps, <SportsMmaIcon/>, 2)}
              {displayPlayers(team.players.supports, <LocalHospitalIcon/>, 2)}
              {displayPlayers(team.players.flex, <AutorenewIcon/>, 1)}
            </List>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                  Bench
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.bench, <ChairIcon/>)}
            </List>
          </Paper>
        </Container>
      </Box>
    :
      <Container>
        <Skeleton variant="rectangular" width={600} height={40} sx={{ margin: "0 auto 1rem auto" }}></Skeleton>
        <Skeleton variant="rectangular" height={400} sx={{ margin: "0 auto" }}></Skeleton>
      </Container>
    }
    </Box>
  );
}

export default TeamView
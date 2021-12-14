import React, { useEffect, useState } from "react";
import { 
  AppBar, Button, Container, List, ListItemButton, ListSubheader, Paper, Skeleton, Typography, 
} from '@mui/material';
import { Players, LeagueTeam } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import { PlayerStatistics } from "../types";

type TeamsResp = {
  team: LeagueTeam;
}

type RosterStatsResp = {
  [player: string]: PlayerStatistics;
}

const TeamView = () => {
  const navigate = useNavigate();
	const { ownerName } = useParams();
  const [team, setTeam] = useState<LeagueTeam>();
  const [rosterStats, setRosterStats] = useState<RosterStatsResp>();

	useEffect(() => {
    ownerName && fetchRoster(ownerName)
			.then((resp: TeamsResp) => {
        setTeam(resp.team)
      })
			.catch(err => console.log(err))
	}, [ownerName]);

	useEffect(() => {
    if (team && team !== undefined) {
      fetchRosterStats(team.players)
        .then((resp: RosterStatsResp) => {
          console.log(resp)
          setRosterStats(resp);
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

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName);
  }

  const displayPlayers = (players: string[], icon: JSX.Element = <React.Fragment/>) => {
    return players.map((player, index) => {
      return (<ListItemButton key={index} onClick={() => navigateToPlayerStats(player)} sx={{ pt: "0.25rem", pb: "0.25rem" }}>
            <Container sx={{ display: "flex", alignItems: "center" }}>
              {icon}
              <Typography variant="subtitle1" sx={{ display: "inline", fontSize: "1.2rem", marginLeft: ".75rem" }}>
                {player}
              </Typography>
              {rosterStats &&
                <React.Fragment>
                  <Typography variant="caption" sx={{ display: "table", marginLeft: "auto" }}>
                    {"Averages"}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "table", marginLeft: "auto" }}>
                    {"Elims: " + (rosterStats[player].totals["Eliminations"]/rosterStats[player].totals["Time Played"]*600).toFixed(4)}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "table", marginLeft: "auto" }}>
                    {"Damage: " + (rosterStats[player].totals["Hero Damage Done"]/rosterStats[player].totals["Time Played"]*600).toFixed(4)}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "table", marginLeft: "auto" }}>
                    {"Deaths: " + (rosterStats[player].totals["Deaths"]/rosterStats[player].totals["Time Played"]*600).toFixed(4)}
                  </Typography>
                </React.Fragment>
              }
            </Container>
        </ListItemButton>
      );
    })
  }

	return (
    <Box>
    {team ? 
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
                <Typography variant="body2" sx={{ opacity: "0.7" }}>{<span><b>Bio: </b>{team.bio}</span>}</Typography>
              </Container>
            </Box>
            <Typography variant="h6">{team.ownerName}</Typography>
            <Typography variant="body2" sx={{ opacity: "0.7" }}>
              {<span><b>Team Motto: </b>{"\"" + team.quote + "\""}</span>}
            </Typography>
          </Box>
        </AppBar>
        <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
          {"< Back"}
        </Button>
        <Container maxWidth="md" sx={{ marginTop: "1rem" }}>
          <Paper elevation={3}>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583" }}>
                  Roster
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.tanks, <ShieldIcon/>)}
              {displayPlayers(team.players.dps, <SportsMmaIcon/>)}
              {displayPlayers(team.players.supports, <LocalHospitalIcon/>)}
              {displayPlayers(team.players.flex, <AutorenewIcon/>)}
            </List>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583" }}>
                  Bench
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.bench)}
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
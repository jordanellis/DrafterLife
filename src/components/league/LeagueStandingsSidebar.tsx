import * as React from 'react';
import { Container, List, ListItemButton, ListItemText, ListSubheader, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Team } from './types';
import { useNavigate } from 'react-router-dom';

type LeagueStandingsProps = {
  teams: Team[];
}

const LeagueStandingsSidebar = ({teams}: LeagueStandingsProps) => {
	const navigate = useNavigate();

  const navigateToTeamPage = (team: Team) => {
    navigate("/league/" + team.owner);
  }

  useEffect(() => {
    teams.sort(compare)
  });

  function compare( a: Team, b: Team ) {
    if (a.wins < b.wins){
      return 1;
    }
    if (a.wins > b.wins){
      return -1;
    }
    if (a.totalPoints < b.totalPoints) {
      return 1;
    }
    if (a.totalPoints > b.totalPoints) {
      return -1;
    }
    return 0;
  }

  return (
    <List
      subheader={
        <ListSubheader sx={{ bgcolor: "unset" }}>
          Leaderboard
        </ListSubheader>
      }
    >
      {teams.map((team, index) => {
        return (<ListItemButton key={index} onClick={() => navigateToTeamPage(team)}>
                  <Typography variant="h5">{index+1}</Typography>
                  <ListItemText primary={
                    <Container>
                      <Typography variant="subtitle1">{team.owner + " (" + team.wins + " - " + team.losses + ")"}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: "1", fontSize: "13px" }}>{team.name}</Typography>
                    </Container>
                  } />
                </ListItemButton>
              );
      })}
    </List>
  );
}

export default LeagueStandingsSidebar
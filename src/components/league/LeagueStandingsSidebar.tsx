import * as React from 'react';
import { Container, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import { useEffect } from 'react';

type LeagueStandingsProps = {
  teams: Team[];
}

type Team = {
  matches: Array<string[]>;
  owner: string;
  name: string;
  wins: number;
  losses: number;
  totalPoints: number;
  players: string[];
}

const LeagueStandingsSidebar = ({teams}: LeagueStandingsProps) => {
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
        return (<ListItemButton key={index}>
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
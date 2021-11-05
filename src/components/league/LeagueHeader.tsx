import React, { useEffect, useState } from "react";
import { 
  ListItemButton,
  Card, 
  Container, 
  Divider, 
  Stack, 
  Typography, 
} from '@mui/material';
import { ScheduledMatches, Team } from "./types";

type LeagueHeaderProps = {
  schedule: ScheduledMatches;
  teams: Team[];
  weekNumber: number;
}

const Header = ({schedule, teams, weekNumber}: LeagueHeaderProps) => {
  const [ownerTeamNameMap, setTeamNameMap] = useState<Map<string, string>>();

  useEffect(() => {
    const ownerTeamName = new Map();
    teams.forEach((team) => {
      ownerTeamName.set(team.owner, team.name);
    });
    setTeamNameMap(ownerTeamName);
	}, [teams]);

	return (
    <Container sx={{ textAlign: "center" }}>
      <Card variant="outlined" square={true} sx={{ display: "inline-block", width: "auto", padding: "0rem 2rem", bgcolor: "#103d6e40" }}>
        <Stack direction="row" margin="0.5rem" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={3}>
          <Typography variant="subtitle1" sx={{ margin: "auto 0" }}>{"Week " + weekNumber + ":"}</Typography>
          {schedule && schedule.matches.map((match, index) => (
            <ListItemButton key={index} sx={{ display: "inline-block", float: "left", flexDirection: "column", textAlign: "center" }}>
              <Typography variant="subtitle2">{ ownerTeamNameMap && ownerTeamNameMap.get(match[0]) }</Typography>
              <Typography variant="caption">vs</Typography>
              <Typography variant="subtitle2">{ ownerTeamNameMap && ownerTeamNameMap.get(match[1]) }</Typography>
            </ListItemButton>
          ))}
        </Stack>
      </Card>
    </Container>
    );
}

export default Header
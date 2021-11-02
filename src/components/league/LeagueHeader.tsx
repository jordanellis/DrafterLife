import React, { useEffect, useState } from "react";
import { 
  Card, 
  Container, 
  Divider, 
  Stack, 
  Typography, 
} from '@mui/material';

type LeagueHeaderProps = {
  schedule: ScheduledMatches;
  teams: Team[];
}

type ScheduledMatches = {
  matches: Array<string[]>;
}

type Team = {
  matches: Array<string[]>;
  owner: string;
  name: string;
  wins: number;
  losses: number;
  players: string[];
}

const Header = ({schedule, teams}: LeagueHeaderProps) => {
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
      <Card variant="outlined" sx={{ display: "inline-block", width: "auto", padding: "0rem 2rem" }}>
        <Stack direction="row" margin="0.5rem" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={3}>
          <Typography variant="subtitle1" sx={{ margin: "auto 0" }}>Matches:</Typography>
          {schedule && schedule.matches.map((match, index) => (
            <Container key={index} sx={{ display: "inline-block", float: "left", flexDirection: "column", textAlign: "center", margin: "auto 0", width: "unset" }}>
              <Typography variant="subtitle2">{ ownerTeamNameMap && ownerTeamNameMap.get(match[0]) }</Typography>
              <Typography variant="caption">vs</Typography>
              <Typography variant="subtitle2">{ ownerTeamNameMap && ownerTeamNameMap.get(match[1]) }</Typography>
            </Container>
          ))}
        </Stack>
      </Card>
    </Container>
    );
}

export default Header
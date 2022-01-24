import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ListItemButton,
  Card, 
  Container, 
  Divider, 
  Stack, 
  Typography, 
} from '@mui/material';
import { Schedule, LeagueTeam } from "./types";

type LeagueHeaderProps = {
  schedule: Schedule;
  teams: LeagueTeam[];
  weekNumber: number;
}

const Header = ({schedule, teams, weekNumber}: LeagueHeaderProps) => {
  const [ownerTeamNameMap, setTeamNameMap] = useState<Map<string, string>>();
  const [matches, setMatches] = useState<Array<string[]>>();

  useEffect(() => {
    const ownerTeamName = new Map();
    teams.forEach((team) => {
      ownerTeamName.set(team.owner, team.name);
    });
    const week = schedule.weeks.find(week => week.week === weekNumber.toString());
    setMatches(week?.matches)
    setTeamNameMap(ownerTeamName);
	}, [schedule, teams, weekNumber]);

	return (
    <Container sx={{ textAlign: "center" }}>
      <Card variant="outlined" square={true} sx={{ display: "inline-block", width: "auto", padding: "0rem 2rem", bgcolor: "#103d6e40" }}>
        <Stack direction="row" margin="0.5rem" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={3}>
          <Typography variant="subtitle1" sx={{ margin: "auto 0" }}>{"Week " + weekNumber + ":"}</Typography>
          {matches && matches.map((match, index) => (
            <Link key={index} to="/league/matchup" state={{home: match[0], away: match[1], weekNumber}}>
              <ListItemButton sx={{ display: "inline-block", float: "left", flexDirection: "column", textAlign: "center" }}>
                <Typography variant="subtitle2" sx={{ color: "white" }}>{ ownerTeamNameMap && ownerTeamNameMap.get(match[0]) }</Typography>
                <Typography variant="caption" sx={{ color: "white" }}>vs</Typography>
                <Typography variant="subtitle2" sx={{ color: "white" }}>{ ownerTeamNameMap && ownerTeamNameMap.get(match[1]) }</Typography>
              </ListItemButton>
            </Link>
          ))}
        </Stack>
      </Card>
    </Container>
    );
}

export default Header
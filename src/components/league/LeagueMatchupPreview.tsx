import React, { useEffect, useState } from "react";
import { 
  ListItemButton,
  Card, 
  Container, 
  Divider, 
  Stack, 
  Typography,
} from '@mui/material';
import { Schedule, LeagueTeam } from "./types";
import { useNavigate } from "react-router";

type LeagueHeaderProps = {
  schedule: Schedule;
  teams: LeagueTeam[];
  weekNumber: number;
}

const LeagueMatchupPreview = ({schedule, teams, weekNumber}: LeagueHeaderProps) => {
  const navigate = useNavigate();
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
      <Typography variant="subtitle2" sx={{ margin: "0.8rem 0", fontWeight: "500", opacity: "70%" }}>{"Week " + weekNumber + " Matches"}</Typography>
      <Card variant="outlined" square={true} sx={{ display: "inline-block", width: "auto" }}>
        <Stack direction="column" margin="0.5rem 0" justifyContent="center" divider={<Divider orientation="horizontal" flexItem />} spacing={1}>
          {matches && matches.map((match, index) => (
            <ListItemButton
              key={index}
              sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}
              onClick={() => navigate("/league/matchup", {state: {home: match[0], away: match[1], weekNumber, isPastMatch: false}})}
            >
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

export default LeagueMatchupPreview
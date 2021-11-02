import { Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeagueHeader from "./LeagueHeader";

type ScheduleResp = {
  data: ScheduledMatches;
}

type ScheduledMatches = {
  matches: Array<string[]>;
}

type TeamsResp = {
  data: Team[];
}

type Team = {
  matches: Array<string[]>;
  owner: string;
  name: string;
  wins: number;
  losses: number;
  players: string[];
}

const LeagueViewHome = () => {
  const [schedule, setSchedule] = useState<ScheduledMatches>();
  const [teams, setTeams] = useState<Team[]>();

	useEffect(() => {
    Promise.all([
			fetchSchedule(),
			fetchTeams()
		])
			.then(([schedule, teams]: [ScheduleResp, TeamsResp]) => {
        setTeams(teams.data);
        setSchedule(schedule.data);
      })
			.catch(err => console.log(err))
	}, []);

	const fetchTeams = async () => {
    const response = await fetch('/api/league/teams');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	const fetchSchedule = async () => {
    const response = await fetch('/api/league/schedule');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  return (
    <Container>
      {schedule && teams && <LeagueHeader teams={teams} schedule={schedule} />}
      <Link style={{ textDecoration: "none" }} to="/">
				<Button variant="text" color="secondary">
					{"< Home"}
				</Button>
			</Link>
			<Typography variant="h2" sx={{ textAlign: "center" }}>
        Sweet Lactations
      </Typography>
			<Typography variant="h6">
        Standings
      </Typography>
			<Typography variant="h6">
        Schedule
      </Typography>
			<Typography variant="h6">
        View my team
      </Typography>
			<Typography variant="h6">
        Free Agents
      </Typography>
    </Container>
  );
}

export default LeagueViewHome;

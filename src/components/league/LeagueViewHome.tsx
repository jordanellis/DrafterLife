import { Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeagueHeader from "./LeagueHeader";
import LeagueStandingsSidebar from "./LeagueStandingsSidebar";

type ScheduleResp = {
  data: ScheduledMatches;
  weekNumber: number;
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
  totalPoints: number;
  players: string[];
}

const LeagueViewHome = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
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
        setCurrentWeek(schedule.weekNumber);
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
    <Container maxWidth={false}>
      {schedule && teams && <LeagueHeader teams={teams} schedule={schedule} weekNumber={currentWeek} />}
      <Link style={{ textDecoration: "none" }} to="/">
				<Button variant="text" color="secondary">
					{"< Home"}
				</Button>
			</Link>
			<Typography variant="h2" sx={{ textAlign: "center" }}>
        Sweet Lactations
      </Typography>
      <Container maxWidth={false} disableGutters sx={{ width: "20%", minWidth: "16rem", display: "inline-block", float: "left" }}>
        {teams && <LeagueStandingsSidebar teams={teams} />}
      </Container>
      <Container sx={{ width: "60%", display: "inline-block", float: "left" }}>
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
    </Container>
  );
}

export default LeagueViewHome;

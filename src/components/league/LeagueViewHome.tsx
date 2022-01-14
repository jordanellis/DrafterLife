import { Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeagueHeader from "./LeagueHeader";
import LeagueStandingsSidebar from "./LeagueStandingsSidebar";
import { ScheduledMatches, LeagueTeam } from "./types";

type ScheduleResp = {
  data: ScheduledMatches[];
}

type TeamsResp = {
  data: LeagueTeam[];
}

const LeagueViewHome = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [schedule, setSchedule] = useState<ScheduledMatches[]>();
  const [teams, setTeams] = useState<LeagueTeam[]>();

	useEffect(() => {
    Promise.all([
			fetchCurrentWeek(),
			fetchSchedule(),
			fetchTeams()
		])
			.then(([currWeek, schedule, teams]: [number, ScheduleResp, TeamsResp]) => {
        setTeams(teams.data);
        setSchedule(schedule.data);
        setCurrentWeek(currWeek);
      })
			.catch(err => console.log(err))
	}, []);

	const fetchCurrentWeek = async () => {
    const response = await fetch('/api/league/currentWeek');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.weekNumber;
  };

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
      <Link style={{ textDecoration: "none" }} to="/">
				<Button variant="text" color="secondary" sx={{ display: "inline-block", float: "left", marginTop: "1.2rem" }}>
					{"< Home"}
				</Button>
			</Link>
      {schedule && teams && <LeagueHeader teams={teams} schedule={schedule[currentWeek]} weekNumber={currentWeek} />}
      <Container maxWidth={false} disableGutters sx={{ width: "20%", minWidth: "16rem", display: "inline-block", float: "left" }}>
        {teams && <LeagueStandingsSidebar teams={teams} />}
      </Container>
      <Container sx={{ width: "60%", display: "inline-block", float: "left" }}>
        <Typography variant="h6">
          Standings
        </Typography>
        <Typography variant="h6">
          View my team
        </Typography>
        <Link style={{ textDecoration: "none" }} to="/league/schedule">
          <Button variant="outlined" color="secondary">
            {"Schedule"}
          </Button>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/league/free-agency">
          <Button variant="outlined" color="secondary">
            {"Free Agents"}
          </Button>
        </Link>
      </Container>
    </Container>
  );
}

export default LeagueViewHome;

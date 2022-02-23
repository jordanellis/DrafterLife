import { Container, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { fetchCurrentWeek, fetchSchedule, fetchLeagueTeams } from "../../service/fetches";
import LeagueMatchupPreview from "./LeagueMatchupPreview";
import LeagueNav from "./LeagueNav";
import LeagueStandingsSidebar from "./LeagueStandingsSidebar";
import LeagueTopScorers from "./LeagueTopScorers";
import { ScheduleWeek, LeagueTeam } from "./types";

const LeagueViewHome = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleWeek[]>();
  const [teams, setTeams] = useState<LeagueTeam[]>();

	useEffect(() => {
    Promise.all([
			fetchCurrentWeek(),
			fetchSchedule(),
			fetchLeagueTeams()
		])
			.then(([currWeek, schedule, teams]: [number, ScheduleWeek[], LeagueTeam[]]) => {
        setTeams(teams);
        setSchedule(schedule);
        setCurrentWeek(currWeek);
      })
			.catch(err => console.log(err))
	}, []);

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ textAlign: "center", mb: "2rem" }}>
        <LeagueNav />
      </Box>
      <Container sx={{ textAlign: "center", mb: "1rem" }}>
        <Typography variant="h4">Sweet Lactations</Typography>
        <Divider/>
      </Container>
      <Container maxWidth={false} disableGutters sx={{ width: "25%", minWidth: "16rem", display: "inline-block", float: "left" }}>
        {teams && <LeagueStandingsSidebar teams={teams} />}
      </Container>
      <Container maxWidth={false} disableGutters sx={{ width: "50%", minWidth: "16rem", display: "inline-block", float: "left" }}>
        <LeagueTopScorers />
      </Container>
      <Container maxWidth={false} disableGutters sx={{ width: "20%", minWidth: "16rem", display: "inline-block", float: "right" }}>
        {schedule && teams && <LeagueMatchupPreview teams={teams} schedule={schedule} weekNumber={currentWeek} />}
      </Container>
    </Container>
  );
}

export default LeagueViewHome;

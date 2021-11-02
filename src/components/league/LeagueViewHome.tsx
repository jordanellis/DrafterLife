import { Button, Container, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LeagueHeader from "./LeagueHeader";

const LeagueViewHome = () => {
  return (
    <Container>
      <LeagueHeader />
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

import React, { useEffect, useState } from "react";
import { LeagueTeam } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useSessionUser } from "../../hooks/useSessionUser";
import { Button, Container, TextField, Typography } from "@mui/material";
import { fetchRoster } from "../../service/fetches";

const LeagueTeamProfile = () => {
  const navigate = useNavigate();
	const [sessionUser] = useSessionUser();
	const { ownerName } = useParams();
  const [team, setTeam] = useState<LeagueTeam>();

	useEffect(() => {
    ownerName && fetchRoster(ownerName)
      .then((teamResp: LeagueTeam) => {
        setTeam(teamResp);
      })
      .catch(err => console.log(err))
  }, [ownerName]);

	return (
    <Box>
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        {"< Back"}
      </Button>
      {team && team.owner === sessionUser && <Container>
        <Typography>{team.ownerName}</Typography>
        <TextField
          required
          label="Team Name"
          value={team.name}
        />
        <TextField
          required
          label="Team Motto"
          value={team.name}
        />
        <TextField
          required
          label="Team Bio"
          value={team.name}
        />
      </Container>}
      
    </Box>
  );
}

export default LeagueTeamProfile
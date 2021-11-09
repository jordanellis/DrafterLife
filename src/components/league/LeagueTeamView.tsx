import React, { useEffect, useState } from "react";
import { 
  AppBar,
  Container, Skeleton, Typography, 
} from '@mui/material';
import { Team } from "./types";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";

type TeamViewParam = {
  ownerName: string;
}

type TeamsResp = {
  team: Team;
}

const TeamView = () => {
	const { ownerName } = useParams<TeamViewParam>();
  const [team, setTeam] = useState<Team>();

	useEffect(() => {
			fetchTeam(ownerName)
			.then((resp: TeamsResp) => setTeam(resp.team))
			.catch(err => console.log(err))
	}, [ownerName]);

	const fetchTeam = async (ownerName: string) => {
    const response = await fetch('/api/league/team/'+ownerName);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	return (
    <Box>
    {team ? 
      <Box>
        <AppBar position="static" sx={{ backgroundColor: "primary.dark" }}>
          <Typography variant="h5">{team.name + " - " + team.owner}</Typography>
          <Typography variant="caption">{team.quote}</Typography>
        </AppBar>
      </Box>
    :
      <Container>
        <Skeleton variant="rectangular" width={600} height={40} sx={{ margin: "0 auto 1rem auto" }}></Skeleton>
        <Skeleton variant="rectangular" height={400} sx={{ margin: "0 auto" }}></Skeleton>
      </Container>
    }
    </Box>
  );
}

export default TeamView
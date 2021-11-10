import React, { useEffect, useState } from "react";
import { 
  AppBar,
  Container, Skeleton, Typography, 
} from '@mui/material';
import { Team } from "./types";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";

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
        <AppBar position="static" sx={{ backgroundColor: "primary.dark", padding: "1rem" }}>
					<Box sx={{ width: "85%", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Container sx={{ margin: "unset", width: "unset", textAlign: "center" }}>
                <PersonIcon sx={{ fontSize: "11rem!important" }} />
              </Container>
              <Container sx={{ margin: "unset", width: "unset" }}>
                <Typography variant="h5">{team.name}</Typography>
                <Typography variant="h6" sx={{ paddingBottom: "1.5rem" }}>{team.wins + "-" + team.losses}</Typography>
                <Typography variant="body2" sx={{ opacity: "0.7" }}>{<span><b>Bio: </b>{team.bio}</span>}</Typography>
              </Container>
            </Box>
            <Typography variant="h6">{team.ownerName}</Typography>
            <Typography variant="body2" sx={{ opacity: "0.7" }}>
              {<span><b>Team Motto: </b>{"\"" + team.quote + "\""}</span>}
            </Typography>
          </Box>
        </AppBar>
        <Typography variant="h5">{"Tanks:"}</Typography>
        {team.players.tanks.map((tank, id) => {
          return (<Typography variant="caption" key={id}>{tank}</Typography>);
        })}
        <Typography variant="h5">{"DPS:"}</Typography>
        {team.players.dps.map((dpsPlayer, id) => {
          return (<Typography variant="caption" key={id}>{dpsPlayer}</Typography>);
        })}
        <Typography variant="h5">{"Supports:"}</Typography>
        {team.players.supports.map((support, id) => {
          return (<Typography variant="caption" key={id}>{support}</Typography>);
        })}
        <Typography variant="h5">{"Flex:"}</Typography>
        {team.players.flex.map((flexPlayer, id) => {
          return (<Typography variant="caption" key={id}>{flexPlayer}</Typography>);
        })}
        <Typography variant="h5">{"Bench:"}</Typography>
        {team.players.bench.map((benchPlayer, id) => {
          return (<Typography variant="caption" key={id}>{benchPlayer}</Typography>);
        })}
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
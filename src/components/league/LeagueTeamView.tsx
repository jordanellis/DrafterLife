import React, { useEffect, useState } from "react";
import { 
  Container, 
} from '@mui/material';
import { Team } from "./types";
import { useParams } from "react-router-dom";

type TeamViewParam = {
  ownerName: string;
}

type TeamViewProps = {
  team: Team;
}

const TeamView = ({location}: any) => {
	const { team }: TeamViewProps = location.state;
	const { ownerName } = useParams<TeamViewParam>();

	return (
    <Container>{team.name + " - " + team.owner}</Container>
  );
}

export default TeamView
import * as React from "react";
import { Container, List, ListItemButton, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useEffect } from "react";
import { LeagueTeam } from "./types";
import { useNavigate } from "react-router-dom";

interface LeagueStandingsProps {
  teams: LeagueTeam[];
}

const LeagueStandingsSidebar = ({teams}: LeagueStandingsProps) => {
	const navigate = useNavigate();

	const navigateToTeamPage = (team: LeagueTeam) => {
		navigate("/league/" + team.owner);
	};

	useEffect(() => {
		teams.sort(compare);
	});

	function compare( a: LeagueTeam, b: LeagueTeam ) {
		if (a.wins < b.wins){
			return 1;
		}
		if (a.wins > b.wins){
			return -1;
		}
		if (a.totalPoints < b.totalPoints) {
			return 1;
		}
		if (a.totalPoints > b.totalPoints) {
			return -1;
		}
		return 0;
	}

	return (
		<List
			subheader={
				<ListSubheader sx={{ bgcolor: "unset", textAlign: "center" }}>
          Leaderboard
				</ListSubheader>
			}
			sx={{ mb: "2rem" }}
		>
			{teams.map((team, index) => {
				return (<ListItemButton key={index} sx={{ ml: "2rem" }} onClick={() => navigateToTeamPage(team)}>
					<Typography variant="h5">{index+1}</Typography>
					<ListItemText primary={
						<Container>
							<Typography variant="subtitle1">{team.owner + " (" + team.wins + " - " + team.losses + ")"}</Typography>
							<Typography variant="subtitle2" sx={{ fontWeight: "1", fontSize: "13px" }}>{team.name}</Typography>
						</Container>
					} />
				</ListItemButton>
				);
			})}
		</List>
	);
};

export default LeagueStandingsSidebar;
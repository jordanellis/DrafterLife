import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect } from "react";

import TeamCard from "./TeamCard";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { Team } from "../types";
import { fetchTeams } from "../../service/fetches";

export default function Teams() {
	const [loading, setLoading] = useState(true);
	const [teams, setTeams] = useState<Team[]>([]);
	const [tab, setTab] = React.useState("east/west");
	const theme = useTheme();
	const screenLargerThanXS = useMediaQuery(theme.breakpoints.up("sm"));
	
	useEffect(() => {
		fetchTeams()
			.then(resp => {
				setTeams(resp);
				setLoading(false);
			})
			.catch(err => console.log(err));
	}, []);

	const tabChange = (_event: React.SyntheticEvent, newValue: string) => {
		setTab(newValue);
	};

	return (
		<Box>
			<Box sx={{ margin: "auto", width: screenLargerThanXS ? "30rem" : "20rem", paddingTop: "1rem" }}>
				<Paper>
					<Tabs
						value={tab}
						onChange={tabChange}
						indicatorColor="secondary"
						textColor="secondary"
						centered
					>
						<Tab label="All" value="east/west" />
						<Tab label="East" value="east" />
						<Tab label="West" value="west" />
					</Tabs>
				</Paper>
			</Box>
			<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{loading && [1,2,3].map((index) => {
					return <Box sx={{ float: "left", margin: ".75rem", textAlign: "center", minWidth: "20rem" }} key={index}>
						<Skeleton variant="rectangular" width={360} height={460} ></Skeleton>
					</Box>;
				})
				}
				{teams.filter(team => tab.includes(team.division)).map((team, key) => (
					<Box sx={{ float: "left", margin: ".75rem", textAlign: "center", minWidth: "20rem" }} key={key}>
						<TeamCard name={team.name} logo={team.logo} players={team.players} colors={team.colors} />
					</Box>
				))}
			</Box>
		</Box>
	);
}
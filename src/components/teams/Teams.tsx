import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect } from "react";

import TeamCard from './TeamCard';
import { Box, Skeleton } from '@mui/material';

type Team = {
	id: number;
	name: string;
	division: string;
	abbr: string;
	players: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
  };
	logo: string;
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	};
}

export default function Teams() {
	const [loading, setLoading] = useState(true);
	const [teams, setTeams] = useState<Team[]>([]);

	const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
	
	useEffect(() => {
		fetchTeams()
			.then(resp => {
					setTeams(resp.data);
					setLoading(false);
				})
			.catch(err => console.log(err))
	}, []);

  const [tab, setTab] = React.useState("east/west");

  const tabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTab(newValue);
  };

  return (
		<Box>
			<Box sx={{ margin: "auto", width: "30rem" }}>
				<Paper sx={{ flexGrow: 1 }}>
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
						</Box>
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
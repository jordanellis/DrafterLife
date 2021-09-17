import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect } from "react";

import TeamCard from './TeamCard';

interface Team {
	id: number;
	name: string;
	division: string;
	abbr: string;
	logo: string;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
	teamRegionTabs: {
		margin: "auto",
		width: "30rem"
	},
	teamContainer: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center"
	},
	teamCard: {
		float: "left",
		margin: ".75rem",
		textAlign: "center",
		minWidth: "20rem"
	}
});

export default function Teams() {
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
		console.log("fetching teams")
		fetchTeams()
			.then(resp => setTeams(resp.data))
			.catch(err => console.log(err))
	}, []);

	const classes = useStyles();
  const [tab, setTab] = React.useState("east/west");

  const tabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTab(newValue);
  };

  return (
		<div>
			<div className={classes.teamRegionTabs}>
				<Paper className={classes.root}>
					<Tabs
						value={tab}
						onChange={tabChange}
						indicatorColor="primary"
						textColor="primary"
						centered
					>
						<Tab label="All" value="east/west" />
						<Tab label="East" value="east" />
						<Tab label="West" value="west" />
					</Tabs>
				</Paper>
			</div>
			<div className={classes.teamContainer}>
				{teams.filter(team => tab.includes(team.division)).map((team, key) => (
					<div className={classes.teamCard} key={key}>
						<TeamCard name={team.name} logo={team.logo} />
					</div>
				))}
			</div>
		</div>
	);
}
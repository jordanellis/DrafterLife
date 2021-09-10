import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import db from "../../Firebase"

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
	
	useEffect(() => {
		const fetchTeams = async () => {
			const resp = await getDocs(collection(db, "teams"));
			console.log("resp", resp);
			const teamsResp: Team[] = [];
			resp.forEach((doc) => {
				const team: Team = {
					id: doc.data().abbr,
					name: doc.data().name,
					division: doc.data().division,
					abbr: doc.data().abbr,
					logo: doc.data().logo
				}
				teamsResp.push(team)
			});
			setTeams(teamsResp.sort((a, b) => (a.name > b.name) ? 1 : -1));
		}

		fetchTeams();
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
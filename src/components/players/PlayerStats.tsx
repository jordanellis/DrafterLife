import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// interface PlayerStatistics {
// 	id: number;
// 	name: string;
// 	division: string;
// 	abbr: string;
// 	players: {
//     tanks: Array<string>,
//     dps: Array<string>,
//     supports: Array<string>
//   };
// }

type PlayerStatsParams = {
	player: string;
};

const useStyles = makeStyles({
  playerStatsGrid: {
    height: "25rem",
    width: "100%"
	}
});

export default function PlayerStats() {
	const classes = useStyles();
	const { player } = useParams<PlayerStatsParams>();

	const [playerStats, setPlayerStats] = useState<any>({});

	const fetchPlayerStats = async () => {
    const response = await fetch("/api/player-stats/" + player);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
	
	useEffect(() => {
		console.log("fetching player data")
		fetchPlayerStats()
			.then(resp => {
				console.log(resp.data)
				setPlayerStats(resp.data)
			})
			.catch(err => console.log(err))
	}, []);

  return (
		<div>
			<Typography variant="h3">
				{ player }
			</Typography>
			<Typography variant="h3">
				{ playerStats["37147"] && playerStats["37147"]["date"] }
			</Typography>
			<div className={classes.playerStatsGrid}>
				<AgGridReact className="ag-theme-balham-dark" rowData={[]} pagination={true} paginationPageSize={25} >
						<AgGridColumn field="esports_match_id"></AgGridColumn>
						<AgGridColumn field="map_type"></AgGridColumn>
						<AgGridColumn field="map_name"></AgGridColumn>
						<AgGridColumn field="player_name"></AgGridColumn>
						<AgGridColumn field="team_name"></AgGridColumn>
						<AgGridColumn field="stat_name"></AgGridColumn>
						<AgGridColumn field="hero_name"></AgGridColumn>
						<AgGridColumn field="stat_amount"></AgGridColumn>
						<AgGridColumn field="start_time"></AgGridColumn>
				</AgGridReact>
			</div>
			<Link style={{ textDecoration: 'none' }} to="/teams/">
				<Button variant="contained" color="primary">
					Back
				</Button>
			</Link>
		</div>
	);
}
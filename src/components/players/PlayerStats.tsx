import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface PlayerStatistics {
	[matchID: string]: {
		week?:						number;
		date?:						Date;
		PlayerMapStats?:	{ [map: string]: PlayerHeroStats};
	}
}

interface PlayerHeroStats {
	[heroName: string]: {
		[statName: string]: number;
	};
}

interface Week {
	week: number;
	start: Date;
	stop: Date;
}

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

	const [playerStats, setPlayerStats] = useState<PlayerStatistics>({});

	const fetchPlayerStats = async (player: String) => {
    const response = await fetch("/api/player-stats/" + player);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.data;
  };

	const fetchWeeks = async () => {
		const response = await fetch("/api/games/weeks");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.data;
	}

	const mapMatchIDsToWeekNumber = (stats: PlayerStatistics, weeks: Week[]) => {
		for (const [key, value] of Object.entries(stats)) {
			weeks.forEach(week => {
				if (!value.date)
					return;
				const date = new Date(value.date).getTime();
				const weekStart = new Date(week.start).getTime();
				const weekStop = new Date(week.stop).getTime();
				if (weekStart < date && date < weekStop) {
					stats[key].week = week.week
				}
			})
		}
	}
	
	useEffect(() => {
		Promise.all([
			fetchPlayerStats(player),
			fetchWeeks()
		]).then(([stats, weeks]) => {
				mapMatchIDsToWeekNumber(stats, weeks);
				setPlayerStats(stats);
				console.log(stats);
		}).catch((err) => {
				console.log(err);
		});
	}, [player]);

  return (
		<div>
			<Typography variant="h3">
				{ player }
			</Typography>
			<Typography variant="h3">
				{ playerStats["37420"] && playerStats["37420"].date }
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
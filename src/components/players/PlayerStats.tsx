import { Box, Button, Card, CardContent, Collapse, Container, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from '@mui/icons-material/Shield';
import SportsMmaIcon from '@mui/icons-material/SportsMma';

type PlayerStatsProps = {
	teamname: string;
	role: string;
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	}
}

type PlayerStatistics = {
	[matchID: string]: PlayerMatch;
}

type PlayerMatch = {
	week?:						number;
	date?:						Date;
	[U: string]: 			any;
}

type Week = {
	week: number;
	start: Date;
	stop: Date;
}

type PlayerStatsParams = {
	player: string;
};

function Row({ stats, colors }: { stats: PlayerMatch, colors: any }) {
  const [open, setOpen] = React.useState(false);
	
  return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: colors.primary+"22" }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{stats.week}
				</TableCell>
				<TableCell align="right">{stats["Match Totals"]["Eliminations"]}</TableCell>
				<TableCell align="right">{stats["Match Totals"]["Hero Damage Done"]}</TableCell>
				<TableCell align="right">{stats["Match Totals"]["Healing Done"]}</TableCell>
				<TableCell align="right">{stats["Match Totals"]["Deaths"]}</TableCell>
			</TableRow>
			<TableRow sx={{ bgcolor: colors.primary+"80" }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Map Breakdown
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Map Name</TableCell>
										<TableCell align="right">Eliminations</TableCell>
										<TableCell align="right">Final Blows</TableCell>
										<TableCell align="right">Assists</TableCell>
										<TableCell align="right">Damage</TableCell>
										<TableCell align="right">Healing</TableCell>
										<TableCell align="right">Deaths</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										Object.keys(stats).map((key, index) => {
											if (!["Match Totals", "date", "week"].includes(key)){
												return (
													<TableRow key={index}>
														<TableCell component="th" scope="row">
															{key}
														</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Eliminations"] ? stats[key]["All Heroes"]["Eliminations"]: 0}
														</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Final Blows"] ? stats[key]["All Heroes"]["Final Blows"]: 0}
														</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Assists"] ? stats[key]["All Heroes"]["Assists"]: 0}
														</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Hero Damage Done"] ? stats[key]["All Heroes"]["Hero Damage Done"]: 0}
														</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Healing Done"] ? stats[key]["All Heroes"]["Healing Done"]: 0}
															</TableCell>
														<TableCell align="right">
															{stats[key]["All Heroes"]["Deaths"] ? stats[key]["All Heroes"]["Deaths"]: 0}
														</TableCell>
													</TableRow>
												);
											} else {
												return null;
											}
										})
									}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
  );
}

export default function PlayerStats({location}: any) {
	const {teamname, colors, role}: PlayerStatsProps = location.state;
	const { player } = useParams<PlayerStatsParams>();

	const [playerStats, setPlayerStats] = useState<PlayerStatistics>({});
	
	useEffect(() => {
		Promise.all([
			fetchPlayerStats(player),
			fetchWeeks()
		]).then(([stats, weeks]) => {
				mapMatchIDsToWeekNumber(stats, weeks);
				setPlayerStats(stats);
		}).catch((err) => {
				console.log(err);
		});
	}, [player]);

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
	
  return (
		<div>
			<Link style={{ textDecoration: "none" }} to="/teams/">
				<Button variant="text" color="primary">
					{"< Teams"}
				</Button>
			</Link>
			<Card sx={{ margin: "auto", maxWidth: 210, background: colors.primary }}>
				<CardContent sx={{ padding: "1!important" }}>
					<PersonIcon sx={{ fontSize: 175, margin: "" }} />
					<Typography variant="body1">
						{ teamname }
					</Typography>
					<Divider sx={{ background: colors.tertiary, opacity: 0.2, marginTop: 1, marginBottom: 1 }} />
					{role.match("tank") && <ShieldIcon
						fontSize="medium"
						sx={{ display: "inline", float: "left", color: colors.secondary }}
						/>}
					{role.match("dps") && <SportsMmaIcon
						fontSize="medium"
						sx={{ display: "inline", float: "left", color: colors.secondary }}
						/>}
					{role.match("support") && <LocalHospitalIcon
						fontSize="medium"
						sx={{ display: "inline", float: "left", color: colors.secondary }}
						/>}
					<Typography variant="subtitle1" color="text.secondary" sx={{ display: "inline", paddingLeft: 1 }} >
						{ player }
					</Typography>
				</CardContent>
    	</Card>
			<Container sx={{ m: 5 }} />
			<TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow >
            <TableCell />
            <TableCell>Week</TableCell>
            <TableCell align="right">Eliminations</TableCell>
            <TableCell align="right">Damage</TableCell>
            <TableCell align="right">Healing</TableCell>
            <TableCell align="right">Deaths</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
					{
						Object.keys(playerStats).map((key, index) => ( 
							<Row key={index} stats={playerStats[key]} colors={colors} />
						))
					}
        </TableBody>
      </Table>
    </TableContainer>
		</div>
	);
}
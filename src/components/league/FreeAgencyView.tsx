import { Button, Checkbox, Container, FormControl, FormControlLabel, IconButton, InputLabel, Link, MenuItem, Paper, Select, SelectChangeEvent, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddBoxIcon from '@mui/icons-material/AddBox';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerStatistics, WeeklyPlayerScores } from "../types";
import { Team } from "../types";
import { LeagueTeam } from "./types";
import { useSessionUser } from "../../hooks/useSessionUser";

type FormattedPlayerData = {
  name: string;
  team: string;
  role: string;
  totals: {
    eliminations: number;
    deaths: number;
    damage: number;
    matches: number;
    assists: number;
    finalBlows: number;
    healing: number;
    timePlayed: number;
  }
  previousScore: number;
  averageScore: number;
  totalScore: number;
  isAvailable: boolean;
}

type PlayerData = {
  [playerName: string]: PlayerStatistics;
}

const FreeAgencyView = () => {
  const navigate = useNavigate();
	const [sessionUser] = useSessionUser();
  const [playerData, setPlayerData] = useState<FormattedPlayerData[]>();
  const [roleFilter, setRoleFilter] = useState("tank/support/dps");
  const [showFreeAgentsOnly, setShowFreeAgentsOnly] = useState(true);
  const [sortByValue, setSortByValue] = useState("totalScore");

  const setTeamAndRole = (player: FormattedPlayerData, teams: Team[]) => {
    teams.forEach(team => {
      if (team.players.dps.includes(player.name)) {
        player.role = "dps";
        player.team = team.name;
        return;
      }
      if (team.players.tanks.includes(player.name)) {
        player.role = "tank";
        player.team = team.name;
        return;
      }
      if (team.players.supports.includes(player.name)) {
        player.role = "support";
        player.team = team.name;
        return;
      }
    });
    if (!player.team) {
      player.team = "Free Agent";
    }
  }

  const setPreviousScore = (weekly_player_scores: WeeklyPlayerScores, currentWeek: number, player: FormattedPlayerData) => {
    if (currentWeek <= 1) {
      player.previousScore = 0;
      return;
    }
    const score = weekly_player_scores[currentWeek-1];
    player.previousScore = score === undefined ? 0 : score;
  }

  const setAverageScore = (weekly_player_scores: WeeklyPlayerScores, currentWeek: number, player: FormattedPlayerData) => {
    if (currentWeek <= 1) {
      player.averageScore = 0;
      return;
    }
    let sum = 0;
    let numScores = 0;
    for (let i = 1; i < currentWeek; i++) {
      const score = weekly_player_scores[i];
      if ((!score && score === undefined) || score === 0) {
        continue;
      }
      numScores++;
      sum += score;
    }
    if (sum === 0) {
      player.averageScore = 0;
    } else {
      player.averageScore = sum/numScores;
    }
  }

  const isPlayerFreeAgent = (name: string, leagueTeams: LeagueTeam[]) => {
    let isPlayerFA = true;
    leagueTeams.forEach(team => {
      if (team.players.tanks.includes(name)) {
        isPlayerFA = false;
      }
      if (team.players.dps.includes(name)) {
        isPlayerFA = false;
      }
      if (team.players.supports.includes(name)) {
        isPlayerFA = false;
      }
      if (team.players.flex.includes(name)) {
        isPlayerFA = false;
      }
      if (team.players.bench.includes(name)) {
        isPlayerFA = false;
      }
    });
    return isPlayerFA;
  }

	useEffect(() => {
    Promise.all([
      fetchCurrentWeek(),
      fetchPlayers(),
			fetchTeams(),
      fetchLeagueTeams()
		])
      .then(([currWeek, players, teams, leagueTeams]: [number, PlayerData, Team[], LeagueTeam[]]) => {
        const formattedPlayerData: FormattedPlayerData[] = [];
        for (let playerName of Object.keys(players)){
          const playerData = players[playerName];
          let formattedPlayer: FormattedPlayerData = {} as FormattedPlayerData;
          formattedPlayer.name = playerName;
          setTeamAndRole(formattedPlayer, teams);
          formattedPlayer.totals = {
            eliminations: playerData.totals["Eliminations"],
            deaths: playerData.totals["Deaths"],
            damage: playerData.totals["Hero Damage Done"],
            matches: playerData.totals["Total Matches"],
            assists: playerData.totals["Assists"],
            finalBlows: playerData.totals["Final Blows"],
            healing: playerData.totals["Healing Done"],
            timePlayed: playerData.totals["Time Played"]
          }
          setPreviousScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
          setAverageScore(playerData.weekly_player_scores, currWeek, formattedPlayer);
          formattedPlayer.totalScore = playerData.total_player_score;
          formattedPlayer.isAvailable = isPlayerFreeAgent(playerName, leagueTeams);
          formattedPlayerData.push(formattedPlayer);
        }
        setPlayerData(formattedPlayerData);
      })
			.catch(err => console.log(err))
	}, []);

  const fetchCurrentWeek = async () => {
    const response = await fetch('/api/league/currentWeek');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.weekNumber;
  };

	const fetchPlayers = async () => {
    const response = await fetch('/api/player-stats');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.data;
  };

	const fetchTeams = async () => {
    const response = await fetch('/api/teams');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.data;
  };

	const fetchLeagueTeams = async () => {
    const response = await fetch('/api/league/teams');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.data;
  };

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName);
  }
  
  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortByValue(event.target.value as string);
  };

  const tabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setRoleFilter(newValue);
  };

  const checkboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowFreeAgentsOnly(event.target.checked);
  };

  const compare = (a: FormattedPlayerData, b: FormattedPlayerData) => {
    const property = sortByValue === "averageScore" ? "averageScore" : "totalScore";
    if ( a[property] < b[property] ){
      return 1;
    }
    if ( a[property] > b[property] ){
      return -1;
    }
    return 0;
  }

  return (
    <Container maxWidth={false}>
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
				{"< Back"}
			</Button>
      {/* <Box>Change role text to icon</Box> */}
      <Typography variant="h2" align="center">Players</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: ".5rem 0" }}>
        <FormControlLabel
          label="Free Agents Only"
          control={
            <Checkbox
              color="secondary"
              checked={showFreeAgentsOnly}
              onChange={checkboxChange}
            />
          }
          sx={{ maxWidth: "15rem" }}
        />
				<Paper sx={{ marginLeft: "4rem", flexGrow: 1, maxWidth: "28rem", maxHeight: "3.07rem" }}>
					<Tabs
						value={roleFilter}
						onChange={tabChange}
						indicatorColor="secondary"
						textColor="secondary"
						centered
					>
						<Tab label="All Roles" value="tank/support/dps" />
						<Tab label="Tank" value="tank" />
						<Tab label="DPS" value="dps" />
						<Tab label="Support" value="support" />
					</Tabs>
				</Paper>
        <FormControl sx={{ flexGrow: 1, maxWidth: "15rem" }}>
          <InputLabel color="secondary">Sort By</InputLabel>
          <Select
            color="secondary"
            label="Sort By"
            value={sortByValue}
            onChange={handleSortByChange}
          >
            <MenuItem value={"averageScore"}>Average Points</MenuItem>
            <MenuItem value={"totalScore"}>Total Points</MenuItem>
          </Select>
        </FormControl>
			</Box>
      <TableContainer component={Paper} sx={{ marginBottom: "1.5rem" }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ bgcolor: "#203547" }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">Average Points</TableCell>
              <TableCell align="right">Total Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playerData && 
              playerData.filter(player => roleFilter.includes(player.role) && (player.isAvailable || !showFreeAgentsOnly))
              .sort(compare).map((player) => (
              <TableRow
                key={player.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 }, paddingBottom: "1 rem" }}
              >
                {player.isAvailable && sessionUser ? 
                <TableCell>
                  <Tooltip title="Add Player">
                    <IconButton color="success" onClick={() => console.log(true)}>
                      <AddBoxIcon fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                : 
                <TableCell>
                  <IconButton disabled>
                    <AddBoxIcon />
                  </IconButton>
                </TableCell>
                }
                <TableCell component="th" scope="row">
                  <Link color="secondary" underline="hover" onClick={() => navigateToPlayerStats(player.name)} sx={{ cursor: "pointer" }}>
                    {player.name}
                  </Link>
                </TableCell>
                <TableCell>{player.role ? player.role : "--"}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell align="right">{player.averageScore.toFixed(2)}</TableCell>
                <TableCell align="right">{player.totalScore.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default FreeAgencyView

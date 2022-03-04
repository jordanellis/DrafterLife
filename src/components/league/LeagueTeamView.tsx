import React, { useCallback, useEffect, useState } from "react";
import { 
  AppBar, Avatar, Backdrop, Button, CircularProgress, Container, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Paper, Skeleton, Tooltip, Typography, 
} from '@mui/material';
import { LeagueTeam } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { PlayerStatistics, Team } from "../types";
import { useSessionUser } from "../../hooks/useSessionUser";
import { fetchRoster, fetchRosterStats, fetchSwap, fetchTeams } from "../../service/fetches";

interface RosterStatsResp {
  [player: string]: PlayerStatistics;
}

interface PlayerInfo {
  team: string;
  role: string;
}

const TANK = "TANK";
const DPS = "DPS";
const SUP = "SUP";
const TeamView = () => {
  const navigate = useNavigate();
	const [sessionUser] = useSessionUser();
	const { ownerName } = useParams();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [team, setTeam] = useState<LeagueTeam>();
  const [rosterStats, setRosterStats] = useState<RosterStatsResp>();
  const [playerInfo, setPlayerInfo] = useState<Map<string, PlayerInfo>>();
  const [playerToSwap, setPlayerToSwap] = useState("");
  const [playerToSwapCurrLocation, setPlayerToSwapCurrLocation] = useState("");
  const [playerToSwapRole, setPlayerToSwapRole] = useState("");

  const initData = useCallback(() => {
    ownerName && fetchRoster(ownerName)
			.then((teamResp: LeagueTeam) => {
        setTeam(teamResp)
        
        if (teamResp && teamResp !== undefined) {
          Promise.all([
            fetchRosterStats(teamResp.players),
            fetchTeams()
          ])
            .then(([resp, teamsResp]: [RosterStatsResp, Team[]]) => {
              setRosterStats(resp);
              let playerInfoMap = new Map<string, PlayerInfo>();
              teamsResp.forEach(teamResp => {
                teamResp.players.tanks.forEach(tank => {
                  playerInfoMap.set(tank, {team: teamResp.name, role: TANK});
                });
                teamResp.players.dps.forEach(dps => {
                  playerInfoMap.set(dps, {team: teamResp.name, role: DPS});
                });
                teamResp.players.supports.forEach(support => {
                  playerInfoMap.set(support, {team: teamResp.name, role: SUP});
                });
              });
              setPlayerInfo(playerInfoMap);
            })
            .catch(err => console.log(err))
        }
      })
			.catch(err => console.log(err))
  }, [ownerName]);

	useEffect(() => initData(), [initData]);

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName);
  }

  const swapPlayers = (playersToSwap: { name: string; newRole: string; }[]) => {
    setBackdropOpen(true);
    fetchSwap(sessionUser, playersToSwap)
      .then(response => {
        if (response.ok) {
          initData();
        }
        setPlayerToSwap("");
        setPlayerToSwapCurrLocation("");
        setPlayerToSwapRole("");
        setBackdropOpen(false);
      });
  };

  const swapPlayerIconButtonClick = (playerName: string, roleAbbr: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (playerToSwap) {
      let playersToSwap = [];
      !"-".includes(playerToSwap) && playersToSwap.push({"name": playerToSwap, "newRole": roleAbbr});
      !"-".includes(playerName) && playersToSwap.push({"name": playerName, "newRole": playerToSwapCurrLocation});
      swapPlayers(playersToSwap);
    } else {
      setPlayerToSwap(playerName);
      setPlayerToSwapCurrLocation(roleAbbr);
      const selectedPlayerInfo = playerInfo ? playerInfo.get(playerName) : undefined;
      setPlayerToSwapRole(selectedPlayerInfo ? selectedPlayerInfo.role : "");
    }
  };

  const shouldDisableListItem = (playerName: string, roleDestination: string) => {
    if (ownerName !== sessionUser) {
      return true;
    }
    const currPlayerInfo = playerInfo?.get(playerName);
    if (playerName !== "" && !"FLEX|BN".includes(playerToSwapCurrLocation) && currPlayerInfo?.role !== playerToSwapCurrLocation) {
      return true;
    }
    if (playerToSwapRole !== "" && roleDestination !== "BN" && roleDestination !== "FLEX" && playerToSwapRole !== roleDestination) {
      return true;
    }
    return false;
  };

  const displayPlayers = (players: string[], roleAbbr: string, avatarColor: string, numToDisplay = -1) => {
    let playerArray = players.map((player, index) => {
      return (<ListItemButton key={index} onClick={() => navigateToPlayerStats(player)} sx={{ pt: "0.1rem", pb: "0.1rem" }}>
            <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "23rem" }}>
                {
                  shouldDisableListItem(player, roleAbbr)
                ?
                  <ListItemAvatar onClick={(e) => {e.stopPropagation()}} sx={{ mr: "1.5rem" }}>
                    <Avatar variant="rounded" sx={{ height: "2rem", width: "4.5rem", color: "#666666", bgcolor: "#888888" }}>
                      <SwapVertIcon/><Typography variant="button">{roleAbbr}</Typography>
                    </Avatar>
                  </ListItemAvatar>
                :
                  <Tooltip title="Swap Player">
                    <ListItemAvatar onClick={(e) => {swapPlayerIconButtonClick(player, roleAbbr, e)}} sx={{ mr: "1.5rem" }}>
                      <Avatar variant="rounded" sx={{ height: "2rem", width: "4.5rem", color: avatarColor, bgcolor: "#232329" }}>
                        <SwapVertIcon/><Typography variant="button">{roleAbbr}</Typography>
                      </Avatar>
                    </ListItemAvatar>
                  </Tooltip>
                }
                <ListItemText
                  primary={player}
                  secondary={playerInfo?.get(player)?.team ?? "-"}
                />
              </Box>
              {rosterStats &&
                <ListItemText
                  primary={<Typography variant="body2">Avg Score:</Typography>}
                  secondary={(rosterStats[player].total_player_score/rosterStats[player].totals["Total Matches"]).toFixed(3)}
                />
              }
            </Container>
        </ListItemButton>
      );
    });
    for (let i = playerArray.length; i < numToDisplay; i++) {
      playerArray.push((<ListItemButton key={i} sx={{ pt: "0.1rem", pb: "0.1rem" }}>
        <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "23rem" }}>
            {
              shouldDisableListItem("", roleAbbr)
            ?
              <ListItemAvatar onClick={(e) => {e.stopPropagation()}} sx={{ mr: "1.5rem" }}>
                <Avatar variant="rounded" sx={{ height: "2rem", width: "4.5rem", color: "#666666", bgcolor: "#888888" }}>
                  <SwapVertIcon/><Typography variant="button">{roleAbbr}</Typography>
                </Avatar>
              </ListItemAvatar>
            :
              <Tooltip title="Swap Player">
                <ListItemAvatar onClick={(e) => {swapPlayerIconButtonClick("-", roleAbbr, e)}} sx={{ mr: "1.5rem" }}>
                  <Avatar variant="rounded" sx={{ height: "2rem", width: "4.5rem", color: avatarColor, bgcolor: "#232329" }}>
                    <SwapVertIcon/><Typography variant="button">{roleAbbr}</Typography>
                  </Avatar>
                </ListItemAvatar>
              </Tooltip>
            }
            <ListItemText primary="-" sx={{ height: "2.75rem" }} />
          </Box>
          <ListItemText secondary="-" sx={{ width: "3rem" }} />
          <ListItemText secondary="-" />
        </Container>
        </ListItemButton>
      ));
    }
    return playerArray;
  }

	return (
    <Box>
    {team && playerInfo ? 
      <Box>
        <AppBar position="static" sx={{ backgroundColor: "primary.dark", padding: "1rem" }}>
					<Box sx={{ width: "85%", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row", mb: "1rem" }}>
              <Box display={{ xs: "none", sm: "flex" }} sx={{ textAlign: "center" }}>
                <PersonIcon sx={{ fontSize: "11rem!important" }} />
              </Box>
              <Box>
                <pre><Typography variant="h5">{team.name + "   " + team.wins + "-" + team.losses}</Typography></pre>
                <Typography variant="h6" sx={{ paddingBottom: "1.5rem" }}>{team.ownerName}</Typography>
                <Typography variant="body2">{<span><b>Bio: </b>{team.bio}</span>}</Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              {<span><b>Team Motto: </b>{"\"" + team.quote + "\""}</span>}
            </Typography>
          </Box>
        </AppBar>
        <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
          {"< Back"}
        </Button>
        <Container maxWidth="sm" sx={{ mb: "2rem" }}>
          <Paper elevation={3}>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                  Starters
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.tanks, TANK, "#3555a3", 1)}
              {displayPlayers(team.players.dps, DPS, "#a55553", 2)}
              {displayPlayers(team.players.supports, SUP, "#55a553", 2)}
              {displayPlayers(team.players.flex, "FLEX", "#754593", 1)}
            </List>
            <List
              subheader={
                <ListSubheader sx={{ bgcolor: "unset", color: "#359583", fontSize: "1rem" }}>
                  Bench
                </ListSubheader>
              }
            >
              {displayPlayers(team.players.bench, "BN", "#666666")}
            </List>
          </Paper>
        </Container>
      </Box>
    :
      <Container>
        <Skeleton variant="rectangular" width={600} height={40} sx={{ margin: "0 auto 1rem auto" }}></Skeleton>
        <Skeleton variant="rectangular" height={400} sx={{ margin: "0 auto" }}></Skeleton>
      </Container>
    }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default TeamView
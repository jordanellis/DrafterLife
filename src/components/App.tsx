import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Box,
  CssBaseline
} from '@mui/material';

import HomePage from "./HomePage";
import LeagueViewHome from "./league/LeagueViewHome";
import LeagueTeamView from "./league/LeagueTeamView";
import PlayerStats from "./players/PlayerStats";
import Teams from "./teams/Teams";
import Header from "./Header";

const App = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Box sx={{ margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/league/" element={<LeagueViewHome />} />
            <Route path="/league/:ownerName" element={<LeagueTeamView />} />
            <Route path="/player-stats/:player" element={<PlayerStats />} />
            <Route path="/teams/" element={<Teams />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
}

export default App

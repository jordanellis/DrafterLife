import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
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

const defaultHistory = createBrowserHistory({ basename: "/" });

const App = ({ history = defaultHistory }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <Router history={history}>
        <Header />
        <Box sx={{ margin: "0 auto" }}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/league/" component={LeagueViewHome} />
            <Route exact path="/league/:ownerName" component={LeagueTeamView} />
            <Route exact path="/player-stats/:player" component={PlayerStats} />
            <Route exact path="/teams/" component={Teams} />
          </Switch>
        </Box>
      </Router>
    </Box>
  );
}

export default App

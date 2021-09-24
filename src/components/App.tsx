import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import {
  CssBaseline
} from '@mui/material';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

import HomePage from "./HomePage";
import MyLeagues from "./league/MyLeagues";
import PlayerStats from "./players/PlayerStats";
import Teams from "./teams/Teams";
import Header from "./Header";

const defaultHistory = createBrowserHistory({ basename: "/" });

const useStyles = makeStyles((theme) => ({
  app: {
    padding: "1rem 5rem",
    margin: "0 auto"
  },
  root: {
    flexGrow: 1,
  }
}));

const App = ({ history = defaultHistory }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router history={history}>
        <Header />
        <div className={classes.app}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/my-leagues/" component={MyLeagues} />
            <Route exact path="/player-stats/:player" component={PlayerStats} />
            <Route exact path="/teams/" component={Teams} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App

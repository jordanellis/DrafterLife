import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  CssBaseline
} from '@material-ui/core';
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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#f79e18"
      },
      secondary: {
        main: "#ffdf70"
      },
      type: 'dark',
    },
  });

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
					<Header />
          <div className={classes.app}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/my-leagues/" component={MyLeagues} />
              <Route exact path="/player-stats/" component={PlayerStats} />
              <Route exact path="/teams/" component={Teams} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App

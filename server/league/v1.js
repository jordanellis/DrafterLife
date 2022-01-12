var express = require("express");
var scheduleData = require("../../data/schedule");
var CURRENT_WEEK = require("../../data/weeknumber").week;
const fs = require('fs');

var api = express.Router();

const LEAGUE_DATA_FILE = './data/league.json';
let leagueData = {}

const readLeaugeData = () => {
  fs.readFile(LEAGUE_DATA_FILE, 'utf-8', (err, data) => {
    if (err) {
      console.log("ERROR: Unable to read from file.");
    }
    leagueData = JSON.parse(data.toString());
  });
}

readLeaugeData();

api.get('/currentWeek', function(req, res) {
  res.send({weekNumber: CURRENT_WEEK});
});

api.get('/schedule', function(req, res) {
  res.send({data: scheduleData["weeks"]});
});

api.get('/teams', function(req, res) {
  res.send({data: leagueData["teams"]});
});

api.get('/team/:owner', function(req, res) {
  const teams = leagueData["teams"];
  var result = teams.find(team => {
    return team.owner === req.params.owner
  })
  res.send({team: result});
});

api.put('/pickup', function (req, res) {
  leagueData["teams"].forEach(team => {
    if (team.owner === req.body.owner) {
      if (team.players.tanks.includes(req.body.playerToDrop)) {
        console.log("removing tank = " + req.body.playerToDrop);
        const index = team.players.tanks.indexOf(req.body.playerToDrop);
        team.players.tanks.splice(index, 1);
      } 
      else if (team.players.dps.includes(req.body.playerToDrop)) {
        console.log("removing dps = " + req.body.playerToDrop);
        const index = team.players.dps.indexOf(req.body.playerToDrop);
        team.players.dps.splice(index, 1);
      } 
      else if (team.players.supports.includes(req.body.playerToDrop)) {
        console.log("removing support = " + req.body.playerToDrop);
        const index = team.players.supports.indexOf(req.body.playerToDrop);
        team.players.supports.splice(index, 1);
      } 
      else if (team.players.flex.includes(req.body.playerToDrop)) {
        console.log("removing flex = " + req.body.playerToDrop);
        const index = team.players.flex.indexOf(req.body.playerToDrop);
        team.players.flex.splice(index, 1);
      } 
      else if (team.players.bench.includes(req.body.playerToDrop)) {
        console.log("removing bench = " + req.body.playerToDrop);
        const index = team.players.bench.indexOf(req.body.playerToDrop);
        team.players.bench.splice(index, 1);
      } 
      else {
        res.status(500);
        res.send('Player not found on '+ req.body.owner +'\'s team.');
        return;
      }
      team.players.bench.push(req.body.playerToAdd);
    }
  })
  fs.writeFile(LEAGUE_DATA_FILE, JSON.stringify(leagueData), (err) => {
    if (err) {
      console.log("ERROR: Unsuccessful attempt to write to file.");
    }
    readLeaugeData();
    res.send('Player successfully picked up.');
  })
});

api.put('/swap', function (req, res) {
  leagueData["teams"].forEach(team => {
    if (team.owner === req.body.owner) {
      req.body.playersToSwap.forEach(player => {
        // remove from current role
        console.log(player);
        if (team.players.tanks.includes(player.name)) {
          const index = team.players.tanks.indexOf(player.name);
          team.players.tanks.splice(index, 1);
        } 
        else if (team.players.dps.includes(player.name)) {
          const index = team.players.dps.indexOf(player.name);
          team.players.dps.splice(index, 1);
        } 
        else if (team.players.supports.includes(player.name)) {
          const index = team.players.supports.indexOf(player.name);
          team.players.supports.splice(index, 1);
        } 
        else if (team.players.flex.includes(player.name)) {
          const index = team.players.flex.indexOf(player.name);
          team.players.flex.splice(index, 1);
        } 
        else if (team.players.bench.includes(player.name)) {
          const index = team.players.bench.indexOf(player.name);
          team.players.bench.splice(index, 1);
        }
        // add back to new role
        if (player.newRole === "TANK") {
          team.players.tanks.push(player.name);
        } else if (player.newRole === "DPS") {
          team.players.dps.push(player.name);
        } else if (player.newRole === "SUP") {
          team.players.supports.push(player.name);
        } else if (player.newRole === "FLEX") {
          team.players.flex.push(player.name);
        } else if (player.newRole === "BN") {
          team.players.bench.push(player.name);
        }
      });
    }
  })
  fs.writeFile(LEAGUE_DATA_FILE, JSON.stringify(leagueData), (err) => {
    if (err) {
      console.log("ERROR: Unsuccessful attempt to write to file.");
    }
    readLeaugeData();
    res.send('Player(s) successfully swapped.');
  })
});

module.exports = api;
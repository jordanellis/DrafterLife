var express = require("express");
var leagueData = require("../data/league");
var scheduleData = require("../data/schedule");

var api = express.Router();

const CURRENT_WEEK = 24;

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

module.exports = api;
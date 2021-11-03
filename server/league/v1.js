var express = require("express");
var leagueData = require("../data/league");
var scheduleData = require("../data/schedule");

var api = express.Router();
const currentWeek = 7;

api.get('/teams', function(req, res) {
  res.send({data: leagueData["teams"]});
});

api.get('/schedule', function(req, res) {
  res.send({data: scheduleData["weeks"][currentWeek], weekNumber: currentWeek});
});

module.exports = api;
var express = require("express");
var leagueData = require("../data/league");
var scheduleData = require("../data/schedule");

var api = express.Router();

const CURRENT_WEEK = 7;

api.get('/currentWeek', function(req, res) {
  res.send({weekNumber: CURRENT_WEEK});
});

api.get('/schedule', function(req, res) {
  res.send({data: scheduleData["weeks"]});
});

api.get('/teams', function(req, res) {
  res.send({data: leagueData["teams"]});
});

module.exports = api;
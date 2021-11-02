var express = require("express");
var leagueData = require("../data/league");
var scheduleData = require("../data/schedule");

var api = express.Router();
const week = 0;

api.get('/teams', function(req, res) {
  res.send({data: leagueData["teams"]});
});

api.get('/schedule', function(req, res) {
  res.send({data: scheduleData["weeks"][week]});
});

module.exports = api;
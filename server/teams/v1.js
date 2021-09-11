var express = require("express");
var teamData = require("../data/teams");

var api = express.Router();

api.get('/', function(req, res) {
  res.send({data: teamData});
});

module.exports = api;
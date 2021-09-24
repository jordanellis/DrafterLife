var express = require("express");
var playerData = require("../data/player_stats");

var api = express.Router();

api.get('/:player', function(req, res) {
  res.send({data: playerData[req.params.player]});
});

module.exports = api;
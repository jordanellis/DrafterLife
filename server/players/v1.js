var express = require("express");
var playerData = require("../data/player_stats");
var teams = require("../data/teams.json");

var api = express.Router();

api.get('/:player', function(req, res) {
  res.send({data: playerData[req.params.player]});
});

api.get('/team/:player', function(req, res) {
  let role;
  const team = teams.find(team => {
    if (team.players.dps.includes(req.params.player)) {
      role = "dps";
      return true;
    }
    if (team.players.tanks.includes(req.params.player)) {
      role = "tank";
      return true;
    }
    if (team.players.supports.includes(req.params.player)) {
      role = "support";
      return true;
    }
    return false;
  });
  res.send({data: {team, role}});
});

api.post('/', (req, res) => {
    const stats = {};
  req.body.players.forEach(player => {
    stats[player] = playerData[player];
  });
  console.log(stats)
  res.send({data: stats});
})

module.exports = api;
var express = require("express");

var api = express.Router();

api.get('/', function(req, res) {
  req.app.db.collection("player-stats").findOne({}, (err, playerStats) => {
    if (err) throw err;
    res.send({data: playerStats});
  });
});

api.get('/:player', function(req, res) {
  req.app.db.collection("player-stats").findOne({}, (err, playerStats) => {
    if (err) throw err;
    res.send({data: playerStats[req.params.player]});
  });
});

api.get('/team/:player', function(req, res) {
  req.app.db.collection("teams").find({}).toArray((err, teamData) => {
    if (err) throw err;
    let role;
    const team = teamData.find(team => {
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
});

module.exports = api;
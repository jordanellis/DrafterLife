var express = require('express');

var api = express.Router();

api.get('/', function(req, res) {
	req.app.db.collection('teams').find({}).toArray((err, teamData) => {
		if (err) throw err;
		res.send({data: teamData});
	});
});

api.get('/allPlayers', function(req, res) {
	req.app.db.collection('teams').find({}, {
		"players.tanks": 1,
		"players.supports": 1,
		"players.dps": 1,
		"_id": 0
	}).toArray((err, teamData) => {
		if (err) throw err;

		let allActivePlayers = [];
		teamData.forEach(team => {
			allActivePlayers.push(...team.players.dps, ...team.players.supports, ...team.players.tanks);
		})
		console.log(allActivePlayers);
		res.send({data: allActivePlayers});
	});
});

module.exports = api;
var express = require('express');
var api = express.Router();

api.get('/currentWeek', function(req, res) {
	req.app.db.collection('weeknumber').findOne({}, (err, weeknumber) => {
		if (err) throw err;
		res.send({weekNumber: weeknumber.week});
	});
});

api.get('/schedule', function(req, res) {
	req.app.db.collection('schedule').find({}).toArray((err, schedule) => {
		if (err) throw err;
		function compare(a, b) {
			if (parseInt(a.week) < parseInt(b.week)){
				return -1;
			}
			if (parseInt(a.week) > parseInt(b.week) ){
				return 1;
			}
			return 0;
		}
		
		schedule.sort(compare);
		res.send({data: schedule});
	});
});

api.get('/teams', function(req, res) {
	req.app.db.collection('league').find({}).toArray((err, teams) => {
		if (err) throw err;
		res.send({data: teams});
	});
});

api.get('/team/:owner', function(req, res) {
	req.app.db.collection('league').findOne({owner: req.params.owner}, (err, team) => {
		if (err) throw err;
		res.send({team});
	});
});

api.get('/team/historic/:owner', function(req, res) {
	const weekNumber = req.query.weekNumber;
	const owner = req.params.owner;
	req.app.db.collection('league').findOne({owner: req.params.owner}, (err, team) => {
		if (err) throw err;

		req.app.db.collection('schedule').find({}).toArray((err, schedule) => {
			if (err) throw err;

			const scheduleWeek = schedule.find(week => {
				return weekNumber === week.week;
			});
			let teamHistoric = JSON.parse(JSON.stringify(team));
			teamHistoric.players = scheduleWeek['final_rosters'][owner];

			res.send({team: teamHistoric});
		});
	});
});

api.put('/pickup', function (req, res) {
	req.app.db.collection('rosterlock').findOne({}, (err, lock) => {
		if (lock.locked) {
			res.status(400).send({
				message: 'Rosters are locked!'
			});
		} else {
			req.app.db.collection('league').findOne({owner: req.body.owner}, (err, team) => {
				if (err) throw err;

				if (team.players.tanks.includes(req.body.playerToDrop)) {
					console.log('removing tank = ' + req.body.playerToDrop);
					const index = team.players.tanks.indexOf(req.body.playerToDrop);
					team.players.tanks.splice(index, 1);
				} 
				else if (team.players.dps.includes(req.body.playerToDrop)) {
					console.log('removing dps = ' + req.body.playerToDrop);
					const index = team.players.dps.indexOf(req.body.playerToDrop);
					team.players.dps.splice(index, 1);
				} 
				else if (team.players.supports.includes(req.body.playerToDrop)) {
					console.log('removing support = ' + req.body.playerToDrop);
					const index = team.players.supports.indexOf(req.body.playerToDrop);
					team.players.supports.splice(index, 1);
				} 
				else if (team.players.flex.includes(req.body.playerToDrop)) {
					console.log('removing flex = ' + req.body.playerToDrop);
					const index = team.players.flex.indexOf(req.body.playerToDrop);
					team.players.flex.splice(index, 1);
				} 
				else if (team.players.bench.includes(req.body.playerToDrop)) {
					console.log('removing bench = ' + req.body.playerToDrop);
					const index = team.players.bench.indexOf(req.body.playerToDrop);
					team.players.bench.splice(index, 1);
				} 
				else {
					res.status(500);
					res.send('Player not found on '+ req.body.owner +'\'s team.');
					return;
				}
				team.players.bench.push(req.body.playerToAdd);
				req.app.db.collection('league').updateOne({owner: req.body.owner}, {$set: { players: team.players }}, function(err, response) {
					if (err) throw err;
					console.log('Player successfully picked up');
					res.send({response});
				});
			});
		}
	});
});

api.put('/swap', function (req, res) {
	req.app.db.collection('rosterlock').findOne({}, (err, lock) => {
		if (lock.locked) {
			res.status(400).send({
				message: 'Rosters are locked!'
			});
		} else {
			req.app.db.collection('league').findOne({owner: req.body.owner}, (err, team) => {
				if (err) throw err;
				req.body.playersToSwap.forEach(player => {
					// remove from current role
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
					if (player.newRole === 'TANK') {
						team.players.tanks.push(player.name);
					} else if (player.newRole === 'DPS') {
						team.players.dps.push(player.name);
					} else if (player.newRole === 'SUP') {
						team.players.supports.push(player.name);
					} else if (player.newRole === 'FLEX') {
						team.players.flex.push(player.name);
					} else if (player.newRole === 'BN') {
						team.players.bench.push(player.name);
					}
				});
				req.app.db.collection('league').updateOne({owner: req.body.owner}, {$set: { players: team.players }}, function(err, response) {
					if (err) throw err;
					console.log('Players successfully swapped');
					res.send({response});
				});
			});
		}
	});
});

api.put('/updateprofile', function (req, res) {
	const updatedProfile = req.body.updatedProfile;
	req.app.db.collection('league').updateOne(
		{owner: req.body.owner},
		{$set: { name: updatedProfile.name, quote: updatedProfile.quote, bio: updatedProfile.bio }},
		function(err, response) {
			if (err) throw err;
			res.send({response});
		}
	);
});

module.exports = api;
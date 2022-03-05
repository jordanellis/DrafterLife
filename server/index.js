const express = require('express');
const path = require('path');
const favicon = require('express-favicon');
const { MongoClient } = require('mongodb');
require('dotenv').config();
var app = express();

const port = process.env.PORT || 5000;
const BUILD_DIR = path.join(__dirname, '../build');
const HTML_FILE = path.join(BUILD_DIR, 'index.html');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jh0gw.mongodb.net/drafterlife?retryReads=true&retryWrites=true&w=majority`;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(client => {
		app.db = client.db('drafterlife');
		app.use(express.static(BUILD_DIR));
		app.use(express.json());
		app.use(favicon(path.join(BUILD_DIR, 'favicon.ico')));

		app.use('/api/games', require('./games/v1'));
		app.use('/api/league', require('./league/v1'));
		app.use('/api/player-stats', require('./players/v1'));
		app.use('/api/teams', require('./teams/v1'));

		app.get('/api/version', ( req, res ) => {
			res.send({version: 'v0.1.0'});
		});

		app.get('/api/posts', ( req, res ) => {
			app.db.collection('posts').find({}).toArray((err, posts) => {
				if (err) throw err;
				res.send({posts});
			});
		});

		app.get('/*', function(req, res) {
			res.sendFile(HTML_FILE);
		});

		app.listen(port, () => {
			console.log(`Listening on port: ${port}`);
		});
	})
	.catch(console.error);


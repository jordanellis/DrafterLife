var express = require('express');
var api = express.Router();

api.get('/weeks', function(req, res) {
	req.app.db.collection('weeks').find({}).toArray((err, weeks) => {
		if (err) throw err;
		res.send({data: weeks});
	});
});

module.exports = api;
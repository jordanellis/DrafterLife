var express = require("express");

var api = express.Router();

api.get('/', function(req, res) {
  req.app.db.collection("teams").find({}).toArray((err, teamData) => {
    if (err) throw err;
    res.send({data: teamData});
  });
});

module.exports = api;
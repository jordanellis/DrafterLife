var express = require("express");
var weekData = require("../data/weeks");

var api = express.Router();

api.get('/weeks', function(req, res) {
  res.send({data: weekData});
});

module.exports = api;
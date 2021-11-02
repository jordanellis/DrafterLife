var express = require("express");
var scheduleData = require("../data/schedule");

var api = express.Router();
const week = 0;

api.get('/schedule', function(req, res) {
  console.log(scheduleData)
  console.log(scheduleData["weeks"])
  console.log(scheduleData["weeks"][0])
  res.send({data: scheduleData["weeks"][week]});
});

module.exports = api;
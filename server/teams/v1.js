var express = require("express");

var api = express.Router();

api.get('/', function(req, res) {
  res.send({data: "Hello from APIv1 root route."});
});

module.exports = api;
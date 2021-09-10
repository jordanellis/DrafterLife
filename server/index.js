const express = require("express");
var app = express();
const port = 5000;

app.use("/api/teams", require("./teams/v1"));

app.get("/api/version", ( req, res ) => {
  res.send({version: "v0.1.0"});
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
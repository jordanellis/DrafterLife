const express = require("express");
var app = express();
const port = 5000;

app.use(express.json());
app.use("/api/games", require("./games/v1"));
app.use("/api/league", require("./league/v1"));
app.use("/api/player-stats", require("./players/v1"));
app.use("/api/teams", require("./teams/v1"));

app.get("/api/version", ( req, res ) => {
  res.send({version: "v0.1.0"});
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
var app = express();
const port = 5000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jh0gw.mongodb.net/drafterlife?retryWrites=true&w=majority`;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    app.db = client.db("drafterlife")
    app.use(express.json());
    app.use("/api/games", require("./games/v1"));
    app.use("/api/league", require("./league/v1"));
    app.use("/api/player-stats", require("./players/v1"));
    app.use("/api/teams", require("./teams/v1"));

    app.get("/api/version", ( req, res ) => {
      res.send({version: "v0.1.0"});
    });

    app.get("/api/posts", ( req, res ) => {
      app.db.collection("posts").find({}).toArray((err, posts) => {
        if (err) throw err;
        res.send({posts});
      });
    });

    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  })
  .catch(console.error)


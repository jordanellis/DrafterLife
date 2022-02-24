const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();
var app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.jh0gw.mongodb.net/drafterlife?retryWrites=true&w=majority`;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    app.db = client.db("drafterlife")
    app.use(express.static('build'));
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

    app.get('/*', function(req, res) {
      console.log("Current directory:", __dirname);
      const fs = require('fs');

      fs.readdir(__dirname, (err, files) => {
        files.forEach(file => {
          console.log(__dirname, file);
        });
      });

      res.sendFile(path.resolve(__dirname, "public/index.html"));
    });

    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  })
  .catch(console.error)


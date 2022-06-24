// server.js
const https = require("https");
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static("static"));
express.static.mime.define({ "text/calendar": ["ics"] });

app.get("/", (req, res) => {
  res.send("Welcome to Squadcast Hackathon 2022");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const express = require("express");

const find_bug = require("./find_bug");

const app = express();
const port = 8086;

app.get('/hoppity/test', (req, res) => {
  res.send("Hello world");
});

app.get('/hoppity/find_bug', (req, res) => {
  res.send("Find bug only accepts post request");
});

app.post('/hoppity/find_bug', find_bug);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

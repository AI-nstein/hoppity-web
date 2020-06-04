const express = require("express");
const bodyParser = require("body-parser");

const { find_bug, find_bug_test } = require("./find_bug");

const app = express();
const port = 8086;

const jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser);

app.get('/test', (req, res) => {
  res.send("Hello world");
});

app.get('/find_bug', find_bug_test);

app.post('/find_bug', find_bug);

app.listen(port, () => console.log(`Hoppity backend listening on port ${port}!`));

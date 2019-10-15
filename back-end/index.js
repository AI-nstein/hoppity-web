const express = require("express");

const find_bug = require("./find_bug");

const app = express();
const port = 8086;

app.get('/hoppity/find_bug', find_bug);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

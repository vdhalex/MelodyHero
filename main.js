var express = require('express');
var app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, './lib')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+"/index.html"));
})

app.listen(3000);
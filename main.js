var express = require('express');
var app = express();
let {PythonShell} = require('python-shell')

// var path = 'piano.wav';

// var options = {
//   args: [path]
// };

PythonShell.run('chroma.py', function (err, results) {
  if (err) throw err;
});

app.get('/', function(req, res) {
  res.send(results)
})

app.listen(3000);
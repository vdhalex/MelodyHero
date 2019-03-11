// import {PythonShell} from 'python-shell';
let {PythonShell} = require('python-shell')
var express = require('express');
var app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '/lib')));
app.use(express.static(path.join(__dirname, '/vendor')));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+"/index.html"));
})


let options = {
  mode: 'text',
  pythonPath: '/chroma.py'
};

PythonShell.run('chroma.py', options, function (err) {
  PythonShell.runString('get_frequencies()', null,  function (err, results)
  {
    if (err) throw err;
    console.log('finished');
  });
  // console.log();("hello world");
  if (err) throw err;
  console.log('finished');
});


app.listen(3000);

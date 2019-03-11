// import {PythonShell} from 'python-shell';
let {PythonShell} = require('python-shell')
var express = require('express');
var app = express();
const path = require('path');
var util = require("util");
var fs = require("fs");
var bb = require("express-busboy");
var ejs = require("ejs");

bb.extend(app, {
  upload: true,
  path: '/uploads',
  allowedPath: /^\/upload$/
})

app.use(express.static(path.join(__dirname, '/lib')));
app.use(express.static(path.join(__dirname, '/vendor')));
app.use(express.static(path.join(__dirname, '/node_modules')));

app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render("index")
})

app.post("/upload", function(req, res, next){
	if (req.files) {
		console.log(util.inspect(req.files));
		if (req.files.file.size === 0) {
		    return next(new Error("Hey, first would you select a file?"));
		}
		fs.exists(req.files.file.file, function(exists) {
			if(exists) {
				console.log("File GOTTETH");

        // This is where we want to call our python script.
        // Onsets is the timing of each note and pitches hold the frequency/notes to be playedNotes
        // IN the future, I hope that the python script will give me letter names for pitches so I don't have to calculate the range on them.
        res.send({filename: req.files.file.filename, onsets: [0.434,1.23,2.11,2.111], pitches: [300, 400, 500, 600]})
			} else {
				res.end("Well, there is no magic for those who don’t believe in it!");
			}
		});
	} else {
    console.log("no files :(");
  }


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

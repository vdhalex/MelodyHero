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

// implemented as a promise because the python would run last regardless of the order in which they were called

let runPy = new Promise (function (fulfill, reject) {
	PythonShell.run('chroma.py', null, function (err, results) {
		if (err) reject(err);
		fulfill(results);
	});
});

// weird format for results (as seen in console log) -- need to fix

runPy.then(function (vals) {
  let size = parseInt(vals[0]);
  console.log(vals.length);
  console.log(size);
  let freqs = []
  let onsets = []
  for (var i = 1; i <= size; i++) {
    freqs.push(parseFloat(vals[i]));
    onsets.push(parseFloat(vals[i+size]));
  }
  console.log(freqs);
  console.log(onsets);
});

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
				// let freqs = [];
				// let onsets = [];

				// PythonShell.run('chroma.py', null, function (err, res) {
				// 	if (err) throw err;
				// 	console.log("finished");
				// 	freqs = res[0];
				// 	onsets = res[1];
				// 	console.log(freqs);
				// 	console.log(onsets);
				// });



        res.send({filename: req.files.file.filename, onsets: [0.434,1.23,2.11,2.111], pitches: [300, 400, 500, 600]})
			} else {
				res.end("Well, there is no magic for those who don’t believe in it!");
			}
		});
	} else {
    console.log("no files :(");
  }
});

app.listen(3000);

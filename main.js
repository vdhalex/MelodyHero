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
			if (exists) {
        console.log("File GOTTETH");
        
        let options = {
          args: [req.files.file.file]
        };

        let runPy = new Promise (function (fulfill, reject) {
          PythonShell.run('chroma.py', options, function (err, results) {
            if (err) reject(err);
            fulfill(results);
          });
        });
        
        runPy.then(function (vals) {
          let size = parseInt(vals[0]);
          let freqs = [];
          let onsets = [];
          for (var i = 1; i <= size; i++) {
            freqs.push(parseFloat(vals[i]));
            onsets.push(parseFloat(vals[i+size]));
          }
        
          var max = Math.max.apply(null,freqs);
          var min = Math.min.apply(null,freqs);
          var midpoint = min + (max - min)/2;
          var firstQuartile = min + (midpoint - min)/2;
          var thirdQuartile = midpoint + (max - midpoint)/2;
          let freqNotes = [];
          for (var i = 0; i < freqs.length; i++) {
            if (freqs[i] >= min && freqs[i] < firstQuartile) {
              freqNotes.push("D");
            } else if (freqs[i] >= firstQuartile && freqs[i] < midpoint) {
              freqNotes.push("F");
            } else if (freqs[i] >= midpoint && freqs[i] < thirdQuartile) {
              freqNotes.push("J");
            } else if (freqs[i] >= thirdQuartile && freqs[i] <= max) {
              freqNotes.push("K");
            }
          }
          console.log(freqNotes);
          console.log(onsets);
        });

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

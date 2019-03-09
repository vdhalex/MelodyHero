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
        res.send({filename: req.files.file.filename, onsets: [1,2,3,3], pitches: [300, 400, 500, 600]})
			} else {
				res.end("Well, there is no magic for those who don’t believe in it!");
			}
		});
	} else {
    console.log("no files :(");
  }
});


app.listen(3000);

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
	// console.log(vals);
	let freqs = vals[0];
	let onsets = [];
	for (var i = 1; i < vals.length; i++) {
    // console.log(parseFloat(vals[i]))
		onsets = onsets.concat(vals[i])
    // divide the string into separate numbers
    // and the parseFloat each of them
    // need a way to get rid of commas and extraneous brackets


    temp = vals[i].split(" ")
    for (var j= 0; j < temp.length; j++) {
      temp[j] = temp[j].split(",")
      console.log(temp[j][0])
      // for (var k = 0; k < temp[j].length; k++){
      //   temp[j]= temp[j].split('')
      // }
    }
    for (var k = 0; k < temp.length; k++){
      console.log(temp[j][0].split(" "))
      console.log(parseFloat(temp[j][0]))
    }


    // console.log(temp)
    // console.log(parseFloat(vals[i]))
    // console.log(typeof vals[i])

	}

  // console.log(onsets)

  // let test = [ '[ 0.42956916  0.59210884  0.77786848  0.94040816  1.11455782  1.27709751',
  //   '  1.42802721  1.59056689  1.70666667  1.76471655  1.88081633  2.00852608',
  //   '  2.1014059   2.55419501  2.60063492  2.71673469  2.85605442  3.2275737',
  //   '  3.40172336  3.75002268  3.90095238  4.01705215  4.07510204  4.27247166',
  //   '  4.37696145  4.41179138  4.7600907   4.93424036  5.07356009  5.12',
  //   '  5.27092971  5.45668934  5.7353288   5.79337868  6.15328798  6.37387755',
  //   '  6.52480726  6.68734694  6.8614966   7.0124263   7.10530612  7.18657596',
  //   '  7.33750567  7.4768254   7.53487528  8.06893424  8.21986395  8.42884354',
  //   '  8.64943311  8.7539229   8.93968254  9.03256236  9.10222222  9.28798186',
  //   '  9.43891156  9.55501134  9.6246712   9.82204082  9.85687075 10.00780045',
  //   ' 10.21678005 10.41414966 11.70285714 11.84217687 11.88861678]' ];

	// console.log(freqs);
	// console.log(onsets);
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




// let options = {
//   mode: 'text',
//   pythonPath: '/chroma.py'
// };

// PythonShell.run('chroma.py', options, function (err) {
//   PythonShell.runString('get_frequencies()', null,  function (err, results)
//   {
//     if (err) throw err;
//     console.log('finished');
//   });
//   // console.log();("hello world");
//   if (err) throw err;
//   console.log('finished');
// });


app.listen(3000);

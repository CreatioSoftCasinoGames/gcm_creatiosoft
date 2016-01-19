var sys = require('sys')
var exec = require('child_process').exec;

var i = 1;
var refreshIntervalId = setInterval(function() {
	console.log(i)
  exec("node test-client.js", function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
	});
  if(i == 80) {
    clearInterval(refreshIntervalId);
  } else {
    i++;
  }
}, 2000);

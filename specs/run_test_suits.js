// Test suits controller
// ====================

// How it works
// ------------
// > It is used to controll the test cases we have written somewhere else 
// > or in other file. We simply run the node command which will run our
// > test case file from here. We already have a list of files so we run 
// > only one test case at a time. We can handle the responses of any 
// > request and broadcast data as well.

//  Declare all the required node packages
var sys = require('sys')
var exec = require('child_process').exec;
var util  = require('util');
var spawn = require('child_process').spawn;
var _  = require('underscore');

//List of all test suits
// --------------
// Simply use any of the following (one case at a time)
// > var testName = "game_start_after_game_over.js";


var testSuits = [];
// testSuits.push("game_start_after_game_over.js");
// testSuits.push("send_game_over_to_all_player_count.js");
// testSuits.push("send_calculation_time_to_all_player_count.js");
// testSuits.push("send_gameStarted_to_all_player_count.js");
// testSuits.push("validate_key_presence_in_all_broadcasts.js");
// testSuits.push("check_all_keys_for_cutomLeaderBoard_separately.js");
// testSuits.push("profile_data_manipulaton.js");
// testSuits.push("profile_and_jackpot_data_verification.js");
// testSuits.push("profile_cache_management.js");
testSuits.push("profile_cache_management_client_data.js");
// testSuits.push("check_tournament_start_button_action.js");

// > Interval timer after which a new player will join the game
// > We simply run the terminal command here after a regular interval
// > (Eg: node test_name)
// > All the responses and broadcasts is recieved here in Buffer format
// > We first convert this buffer into string and then parse it as object
var childProcceses = [];
// > Define counter and limits for players to be added for this test
var playerCounter = 1, playerLimit = 50, counter = 0;
_.each(testSuits, function(testSuit) {
  // > Outout the name of test case we are running
console.log('\nExecuting test suite - \n' + testSuit + '\n')
  var refreshIntervalId = setInterval(function() {
    var node = spawn('node', [testSuit]);
    childProcceses.push(node)
    console.log(playerCounter + ' player added in game!');
    node.stdout.on('data', function (data) {
      data = data.toString('utf-8');
      // console.log(data);
      // if(data[0] == "{") {
      //  data = JSON.parse(data);
      //   console.log(data);
      //  if(data.killProcess) {
      //    console.log('Case failed - ' + data.reason)
      //  console.log('In jackpot case there are chances that it happened because redis take some time to update values, use callback to resolve!');
      //   _.each(childProcceses, function(process) {
      //      clearInterval(refreshIntervalId);
      //      process.kill();  
      //    });
      //  } else {
      //    if(data.route == "gameOver") {
      //      counter++;
      //      console.log(counter + "gameOver broadcast received.");
      //      if(counter == playerLimit) {
      //        counter = 0;
      //      }
      //    } 
      //  }
      // }
    });

    // > Output only if there is any error occured during test case processing
    node.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    // > Exit from the controller
    node.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });

    // > Condition to restrict adding players in the game
    if(playerCounter == playerLimit) {
      clearInterval(refreshIntervalId);
    }

    // > playCounter increment in order to add and check Add Player condition 
    playerCounter++;

  }, 500);
});

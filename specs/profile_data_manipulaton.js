var slotConstants = require('../../game-server/config/slotConstants.json')["development"];
var backendFetcher = require('../../game-server/app/util/backendFetcher');
var redis = require('redis').createClient(slotConstants.redisPort, slotConstants.redisHost, {});
var _ = require('underscore');
var sockets = {}

var app = {
  get: function() {
    return slotConstants
  }
}


var Robot = function(tokens, sendSpin){
	var that = this;
  this.pomelo = require("./pomelo-node-client.js").pomelo;
  this.tokens = tokens;
  this.sendSpin = sendSpin;
  this.gameStartedSent = false;
  this.caseFailed = {killProcess: true};

  this.pomelo.on("jackpot", function(data) {
    // console.log(data);
  });
  this.pomelo.on("customLeaderBoard", function(data) {
  	// that.checkKeyPresence(data, function(data) {
   //  	console.log(data);
   //  })
    // console.log(data);
  });
  this.pomelo.on("gameOver", function(data) {
  	that.checkKeyPresence('gameOver', data, function(data) {});
    //TODO: Start a new game from here using connector.entryHandler.levelUpdate request
  });
  this.pomelo.on("calculationTime", function(data) {
  	that.checkKeyPresence('calculationTime', data, function(data) {});
    //TODO: Just to check if this broadcast is coming or not
  });
  this.pomelo.on("gameStarted", function(data) {
    //TODO: Just to check if this broadcast is coming or not
    that.gameStartedSent = true;
    console.log(JSON.stringify(data));
    that.checkKeyPresence('gameStarted', data, function(data) {});
  });
};

Robot.prototype = {
  run: function() {
    var that = this;
    that.pomelo.init({
      host: "127.0.0.1",
      port: "3014",
      log: true
    }, function() {

      that.pomelo.request("gate.gateHandler.getConnector", {is_guest: true, loginType: "login", device_id: that.deviseId, deviceType: "Android", gameVersion: "1.0.0"}, function(data) {
        if(data.loginSuccess){
          console.log(data)
        } else {
          console.log("Key mismatch !");
        }
      });
    });
  },

  connectPomelo: function() {
    var that = this;
    that.pomelo.init({
      host: "127.0.0.1",
      port: "3010",
      log: true
    }, function() {
      that.sessionId = that.pomelo.socket.socket.sessionid;
      sockets[that.sessionId] =  _.extend({}, that.pomelo);
      that.pomelo.request("connector.entryHandler.enter", {login_token: that.tokens.login_token, previous_login_token: that.tokens.previous_login_token}, function(data) {
        that.checkKeyPresence("enter", data, function(checkPass){
          if(checkPass) {
            that.startGame();
          }
        });
      });
    }); 
  },

  startGame: function() {
    var that = this;
    var loginToken = that.tokens.login_token;
      that.pomelo.request("connector.entryHandler.joinMachine", {machineId: 1}, function(data) {
      that.checkKeyPresence("joinMachine", data, function(checkPass){
        if(checkPass) {
          if(data.startsIn == 0 && data.endsIn == 0) {
            that.caseFailed.reason = 'The game will not start as startsIn and endsIn equals 0';
            that.caseFailed.data = data;
            console.log(JSON.stringify(that.caseFailed));
          } else {
          	// Create a timout for tournament start to check if gameStarted fired or not
          	// Make sure the time is +1 sec to timeout of this tournament
          	setTimeout(function(){
          		if(!that.gameStartedSent) {
                that.caseFailed.reason = 'gameStarted broadcast didn\'t fired !! \n Make sure you have restarted the pomelo for this test suit.';
                that.caseFailed.data = {};
                console.log(JSON.stringify(that.caseFailed));
              } else {
                console.log('gameStarted broadcast has been fired.');
              }
					    that.gameStartedSent = false;
          	}, 6000);
            if(that.sendSpin) {
              var spinInterval = setInterval(function() {
                var bet = Math.floor(Math.random() * (1000 - 10 + 1)) + 100; // Bet range (10-1000)
                var win = Math.floor(Math.random() * (1000 - 0 + 1)) + 100; // Win range (0-3000)
                var effectiveCoins = win-bet;
                sockets[that.sessionId].request("slot.slotHandler.spinStatus", {coinsBet: bet, coinsWin: win}, function(data) {
                  that.checkKeyPresence("spinStatus", data, function(checkPass){
                    if(checkPass) {
                      // > Get user profile from backend and update total_coins into his/her pfrofile
                      backendFetcher.get("/api/v1/users/"+loginToken+".json", {}, app, function(user){
                        if(!!user) {
                          var totalCoins = user.total_coins + effectiveCoins
                          backendFetcher.put("/api/v1/users/"+loginToken+".json", {total_coins: totalCoins}, app, function(data){
                            if(data.success) {
                              backendFetcher.get("/api/v1/users/"+loginToken+".json", {}, app, function(user){
                                if(user.total_coins != totalCoins) {
                                  that.caseFailed.reason = 'The sent amount and updated amount are not same!';
                                  that.caseFailed.data = {};
                                  console.log(JSON.stringify(that.caseFailed));
                                }
                              });
                            } else {
                              that.caseFailed.reason = 'Error while updating coins to user profile ! token - ' + loginToken;
                              that.caseFailed.data = {};
                              console.log(JSON.stringify(that.caseFailed));
                            }
                          });
                        } else {
                          that.caseFailed.reason = 'Error in getting user profile from rails! token - ' + loginToken;
                          that.caseFailed.data = {};
                          console.log(JSON.stringify(that.caseFailed));
                        }
                      });
                      // > Stop spinning and restart game case check
                      if(!!data.code && data.code == 550) {
                        clearInterval(spinInterval)
                        setTimeout(function() {
                          // console.log('Start a new game!')
                          that.startGame();
                        }, 5000)
                      }
                    }
                  });
                });
              }, 4000);
            }
          }
        }
      });
    })
  },

  checkKeyPresence: function(route, object, cb) {
    var expectedKeys = [];
    if(route == "enter") {
      expectedKeys = 	[	'code', 'message', 'route' ].sort();;
    } else if (route == "joinMachine") {
      expectedKeys = 	[	'endsIn', 'gameProgress', 'level', 'machineId', 'machineName', 'playerId',
                        'playerPoints', 'pointsRequired', 'route', 'startsIn', 'success', 'tournamentId', 'tournamentStart' ].sort();
    } else if (route == "spinStatus") {
      expectedKeys = 	[	'code', 'msg', 'playerPoints', 'route', 'success' ].sort();
    } else if (route == 'gameOver') {
    	expectedKeys =	[	'id', 'machine_id', 'machine_name', 'point', 'prize', 'rank', 'route', 'success', 'uid'	];
    } else if (route == 'calculationTime') {
    	expectedKeys =	[	'route', 'startsIn'	];
    } else if (route == 'gameStarted') {
    	expectedKeys =	[	'pot', 'route'	];
    }

    var presentKeys = _.keys(object).sort();
    if(!_.isEqual(presentKeys, expectedKeys)) {
      that.caseFailed.reason = 'All keys are not present in route response - ' + route;
      that.caseFailed.data = object;
      console.log(JSON.stringify(that.caseFailed));
      cb(false);
    } else {
      cb(true);
      // >> Check nested json if exists in any response
      if(route == "joinMachine") {
        this.checkNestedKeys("joinMachine/gameProgress", object.gameProgress);
      }
    }
  },

  checkNestedKeys: function(route, object) {
    var expectedKeys = [];
    if (route == "joinMachine/gameProgress") {
      expectedKeys =  [ 'awards', 'machineNumber', 'pot', 'remainingList', 'topThreeList', 'totalPlayers' ].sort();
    }
    var presentKeys = _.keys(object).sort();
    if(!_.isEqual(presentKeys, expectedKeys)) {
      that.caseFailed.reason = 'All keys are not present in route response - ' + route;
      that.caseFailed.data = object;
      console.log(JSON.stringify(that.caseFailed));
    }
  }

}

userAccessToken = Math.random().toString(36).slice(2) + Math.random().toString(16).slice(2);
backendFetcher.post("/api/v1/sessions.json", {is_guest: true, device_id: userAccessToken, device: "Android", game_version: "1.0"}, app, function(user) {
  redis.sadd("game_players", "game_player:" + user.login_token);
  redis.hmset("game_player:"+user.login_token, "uid", user.id, "previous_login_token", user.previous_login_token, "player_id", user.id, "first_name", user.first_name, "player_name", (user.first_name + ' ' + user.last_name), "player_level", user.current_level, "player_image", user.image_url, "online", 1);
  var robot = new Robot(user, true);
  robot.connectPomelo();
});

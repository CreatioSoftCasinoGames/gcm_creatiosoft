// var env = "development";
var env = "production";
var slotConstants = require('../../game-server/config/slotConstants.json')[env];
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
      host: env == "development" ? "127.0.0.1" : "gate.slits.online",
      port: env == "development" ? "3014" : "5000",
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
    redis.get("connector-server-1", function(err, s1strength){
      redis.get("connector-server-2", function(err, s2strength){
        connector = parseInt(s1strength) > parseInt(s2strength) ? "connector02.slits.online" : "connector01.slits.online";
        console.log(connector);
        that.pomelo.init({
          host: env == "development" ? "127.0.0.1" : connector,
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
      });  
    });
  },

  //  > This will join a player in a machine and start spinning on behalf of this player as well
  startGame: function() {
    var that = this;
    var loginToken = that.tokens.login_token;
    // var machineId = Math.floor(Math.random() * (10 - 1 + 1));
    //     machineId = parseInt(machineId) > 10 ? 10 : parseInt(machineId);
    var machineId = 1;
      that.pomelo.request("connector.entryHandler.joinMachine", {machineId: machineId}, function(data) {
      that.checkKeyPresence("joinMachine", data, function(checkPass){
        if(checkPass) {
          if(data.startsIn == 0 && data.endsIn == 0 || false) {
            that.caseFailed.reason = 'The game will not start as startsIn and endsIn equals 0';
            that.caseFailed.data = data;
            console.log(JSON.stringify(that.caseFailed));
          } else {
          	// Create a timout for tournament start to check if gameStarted fired or not
          	// Make sure the time is +1 sec to timeout of this tournament
         //  	setTimeout(function(){
         //  		if(!that.gameStartedSent) {
         //        that.caseFailed.reason = 'gameStarted broadcast didn\'t fired !! \n Make sure you have restarted the pomelo for this test suit.';
         //        that.caseFailed.data = {};
         //        console.log(JSON.stringify(that.caseFailed));
					    // } else {
					    // 	console.log('gameStarted broadcast has been fired.');
					    // }
					    // that.gameStartedSent = false;
         //  	}, 6000);
            if(that.sendSpin) {
              var spinInterval = setInterval(function() {
                var bet = Math.floor(Math.random() * (1000 - 10 + 1)) + 100; // Bet range (10-1000)
                var win = Math.floor(Math.random() * (1000 - 0 + 1)) + 100; // Win range (0-3000)
                redis.hgetall("user_profile:"+that.tokens.id, function(err, preDetails){
                	sockets[that.sessionId].request("slot.slotHandler.spinStatus", {coinsBet: bet, coinsWin: win}, function(data) {
	                  that.checkKeyPresence("spinStatus", data, function(checkPass){
	                    if(checkPass) {
	                    	// Check profile values in redis
	                    	// Set a timeout for 1-2 second in order to all values get updated in redis properly
                        
                        // Update profile details (used by client only)
                        var newCoins        = (bet > win && (bet-win) > 0) ? (bet-win) : (win-bet),
                            newStars        = Math.floor(Math.random() * (1000 - 10 + 1)) + 100, // Stars range (10-1000)
                            newBetIndex     = Math.floor(Math.random() * (10 + 1)), // Stars range (1-10)
                            newBetPerLine   = Math.floor(Math.random() * (10 + 1)), // Stars range (1-10)
                            // newCurrentLevel = Math.floor(Math.random() * (1 - 0 + 1)); // Level range (0-1)
                            newCurrentLevel = 0;

                        // sockets[that.sessionId].request(  "slot.slotHandler.updateProfile", {
                        //                                   totalCoins    : parseInt(preDetails.total_coins) + newCoins,
                        //                                   stars         : parseInt(preDetails.stars) + newStars,
                        //                                   betIndex      : newBetIndex,
                        //                                   betPerLine    : newBetPerLine,
                        //                                   currentLevel  : parseInt(preDetails.current_level) + newCurrentLevel
                        //                                 }, function(data){

                        //                                 });
                        
	                      if(!!data.code && data.code == 550) {
                          console.log('Game started ')
	                        clearInterval(spinInterval)
	                        setTimeout(function() {
	                          // console.log('Start a new game!')
	                          that.startGame();
	                        }, 5000)
	                      }
	                    }
	                  });
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
    var expectedKeys = [],
    that = this;
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
    } else {
      // Expecting this case is for jackpot data only (because of missing route key in onject)
      expectedKeys =  [ 'major', 'major_id', 'min', 'min_id' ]
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
    var expectedKeys = [],
    that = this;
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
  redis.sadd("user_profiles:1-1000", "user_profile:"+parseInt(user.id));
  redis.hmset(	"user_profile:"+parseInt(user.id),
                "id", parseInt(user.id),
                "total_coins", parseInt(user.total_coins),
                "stars", (!!user.stars ? parseInt(user.stars) : 0),
                "bet_index",  parseInt(user.bet_index),
                "bet_per_line", parseInt(user.bet_per_line),
                "current_level", parseInt(user.current_level),
                "machine_unlocked", user.machine_unlocked,
                "version", user.version,
                "celebrations", 0,
                "reward", 0,
                "total_bet", parseInt(user.total_bet),
                "coins_won", parseInt(user.coins_won),
                "coins_lost", parseInt(user.coins_lost),
                "total_spin", parseInt(user.total_spin),
                "online", true
  						);


  var robot = new Robot(user, true);
  robot.connectPomelo();
});

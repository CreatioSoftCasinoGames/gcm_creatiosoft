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
  this.pomelo = require("./pomelo-node-client.js").pomelo;
  this.tokens = tokens;
  this.sendSpin = sendSpin;
  this.caseFailed = {killProcess: true};

  this.pomelo.on("jackpot", function(data) {
    // console.log(data);
  })
  this.pomelo.on("customLeaderBoard", function(data) {
    // console.log(data);
  })
  this.pomelo.on("gameOver", function(data) {
    //TODO: Start a new game from here using connector.entryHandler.levelUpdate request
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
  	that.pomelo.request("connector.entryHandler.joinMachine", {machineId: 1}, function(data) {
      if(!!data && data.tournamentStart) {
        that.checkKeyPresence("joinMachine", data, function(checkPass){
          if(checkPass) {
            if(data.startsIn == 0 && data.endsIn == 0) {
              that.caseFailed.reason = 'The game will not start as startsIn and endsIn equals 0';
              that.caseFailed.data = data;
              console.log(JSON.stringify(that.caseFailed));
            } else {
              if(that.sendSpin) {
                var spinInterval = setInterval(function() {
                  sockets[that.sessionId].request("slot.slotHandler.spinStatus", {coinsBet: 1000, coinsWin: 3000}, function(data) {
                    that.checkKeyPresence("spinStatus", data, function(checkPass){
                      if(checkPass) {
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
      } else {
        that.caseFailed.reason = 'Tournament will not start';
        that.caseFailed.data = data;
        console.log(JSON.stringify(that.caseFailed));
      }
    })
  },

  checkKeyPresence: function(route, object, cb) {
    var expectedKeys = [];
    if(route == "enter") {
      expectedKeys = [  'code', 'message', 'route' ];
    } else if (route == "joinMachine") {
      expectedKeys = [  'endsIn', 'gameProgress', 'level', 'machineId', 'machineName', 'playerId',
                        'playerPoints', 'pointsRequired', 'route', 'startsIn', 'success', 'tournamentId', 'tournamentStart' ]
    } else if (route == "spinStatus") {
      expectedKeys = [  'code', 'msg', 'playerPoints', 'route', 'success' ]
    }

    var presentKeys = _.keys(object).sort();
    if(!_.isEqual(presentKeys, expectedKeys)) {
      this.caseFailed.reason = 'All keys are not present in route response - ' + route;
      this.caseFailed.data = object;
      console.log(JSON.stringify(this.caseFailed));
      cb(false);
    } else {
     if(route == "joinMachine") {
        this.checkNestedKeys("joinMachine/gameProgress", object.gameProgress);
      } else {
        cb(true);
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
      this.caseFailed.reason = 'All keys are not present in route response - ' + route;
      this.caseFailed.data = object;
      console.log(JSON.stringify(this.caseFailed));
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

var slotConstants = require('../game-server/config/slotConstants.json')["development"];
var backendFetcher = require('../game-server/app/util/backendFetcher');
var redis = require('redis').createClient(slotConstants.redisPort, slotConstants.redisHost, {});
var _ = require('underscore');
var sockets = {}

var app = {
  get: function() {
    return slotConstants
  }
}


var Robot = function(tokens, sendSpin){
  this.pomelo = require("./specs/pomelo-node-client.js").pomelo;
  this.tokens = tokens;
  this.sendSpin = sendSpin;
  // tokens.sessionid = this.pomelo.socket.socket.sessionid;
  // sockets[this.pomelo.socket.socket.sessionid] = 
  this.pomelo.on("jackpot", function(data) {
    // console.log(data)
  })
  this.pomelo.on("customLeaderBoard", function(data) {
    // console.log(data)
  })
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
          // that.pomelo.disconnect();
          // that.connectPomelo(data)
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
        that.pomelo.request("connector.entryHandler.joinMachine", {machineId: 1}, function(data) {
          if(that.sendSpin) {

            setInterval(function() {
              sockets[that.sessionId].request("slot.slotHandler.spinStatus", {coinsBet: 1000, coinsWin: 3000}, function(data) {
                // console.log(data)
              });
            }, 4000);
          }
        })
      });
    }); 
  }  

}



userAccessToken = Math.random().toString(36).slice(2) + Math.random().toString(16).slice(2);
backendFetcher.post("/api/v1/sessions.json", {is_guest: true, device_id: userAccessToken, device: "Android", game_version: "1.0"}, app, function(user) {
  redis.sadd("game_players", "game_player:" + user.login_token);
  redis.hmset("game_player:"+user.login_token, "uid", user.id, "previous_login_token", user.previous_login_token, "player_id", user.id, "first_name", user.first_name, "player_name", (user.first_name + ' ' + user.last_name), "player_level", user.current_level, "player_image", user.image_url, "online", 1);
  var robot = new Robot(user, true);
  robot.connectPomelo();
});

// Slot client Robot Working
// =============
// Declaration of required files and variables
// > 1- Require slotConstant and backendFetcher files here in order to access their methods,
// > 2- Create a redis client here in order to acces redis commands in this client
// > 3- Underscore is a javascript package 
var slotConstants = require('../../game-server/config/slotConstants.json')["production"];
var backendFetcher = require('../../game-server/app/util/backendFetcher');
var redis = require('redis').createClient(slotConstants.redisPort, slotConstants.redisHost, {});
var _ = require('underscore');
var sockets = {}

// Declaration of mock object of app
// > Define all the inside methods that we are using in our gaming module
var app = {
  get: function() {
    return slotConstants
  }
}

// Create a Robot pomelo client in order to access pomelo functionalities
// > 1- Create and define variables for this Robot client that will be accessed later
// > 2- Here we can also accept all the event emitter events such as broadcasts
var Robot = function(tokens, sendSpin){
  this.pomelo = require("./pomelo-node-client.js").pomelo;
  this.tokens = tokens;
  this.sendSpin = sendSpin;
  this.pomelo.on("jackpot", function(data) {
  })
  this.pomelo.on("customLeaderBoard", function(data) {
  })
};

// Declaration of methoda that will be accessed by Robot client
// > This block is used for first request to gate server in order to process login
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

  // Connect a player with a server and then access the route APIs
  // > 1- Intiate a pomelo client on a predefined host and port and bind this user with a server session
  // > 2- Once a user is connected then we can access any route we have defined in our app
  // > 3- Here we connect a player, join this user to a machine and then start spinning after a 4 second interval
  // > 4- The next request is being only made if we got the response of previous requests (if any)
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
              });
            }, 4000);
          }
        })
      });
    }); 
  }  

}

// Create a new user and connect this user with pomelo
// > 1- userAccessToken is used as unique deviceId created at server side
// > 2- create a new user by posting a request on rails server through backendFetcher
// > 3- when rails sends user's profile then save required details in redis as well that will be used for further processing
userAccessToken = Math.random().toString(36).slice(2) + Math.random().toString(16).slice(2);
backendFetcher.post("/api/v1/sessions.json", {is_guest: true, device_id: userAccessToken, device: "Android", game_version: "1.0"}, app, function(user) {
  redis.sadd("game_players", "game_player:" + user.login_token);
  redis.hmset("game_player:"+user.login_token, "uid", user.id, "previous_login_token", user.previous_login_token, "player_id", user.id, "first_name", user.first_name, "player_name", (user.first_name + ' ' + user.last_name), "player_level", user.current_level, "player_image", user.image_url, "online", 1);
  var robot = new Robot(user, true);
  robot.connectPomelo();
});

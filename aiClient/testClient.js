
var http                = require('http');
var _ld                 = require("lodash");
var queryString         = require('querystring');
var mongoose            = require("mongoose");
var async               = require("async");
var pomelo              = require("./pomeloClient").pomelo;
var statesOfX           = require("./statesOfX");

var testClient = {};

var botProfileArgs = {
  channelId       : null,
  playerId        : null,
  playerName      : "Hum Hoon PK",
  buyInAmount     : 500,
  amount          : 50,
  sidPlayer       : -1,
  playerSeatIndex : 0,
  playerState     : null,
  isStandUp       : true,
  isHighCard      : false,
  totalMoves      : 0,
  totalBlind      : 0,
  totalChaal      : 0,
  maxChaalLimit   : 0,
  maxBlindLimit   : 0,
  seenCards       : false,
  totalPlayers    : 0
};

var totalBotProfiles  = [];
var turnTimeout       = null;
var botSitTimer       = null;
var tables            = {};
var names             = [ "Tanya","rahul","priyanka","Abhishek","divya","aditya","Tanvi","Amit","priya",
                          "mahesh","Riya","Yash","Sneha","rohit","Aishwarya","Shyam","Vani","deepak","Shreya","Arjun",
                          "Gayatri","Parth","tanu","ankur","Ayushi","Manoj","Krithika","Mayank","Isha","Rakesh","anjali",
                          "Ankit","nishi","Karan","shivani","Aryan","ishita","Raj","Anushri","Vinay","shivangi" ]

function sendRequest (route, method, data, cb){
  var options = {
        host: '192.168.1.6',
        port: 3001,
        path: route,
        method: method,
        headers: {
            'Content-Type':  'application/json',//'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var httpreq = http.request(options, function (response) {
        console.log("Request send to url " + options.host+options.path);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            connectPomelo(options.host, "3014")
        });
        response.on('end', function() {
            // console.log("REQUEST SEND !!");
        });
    });
    httpreq.write(data);
    httpreq.end();
}

function connectPomelo(host, port) {
  pomelo.init({
    host: "192.168.1.6",
    port: 3050,
    log: true
  }, function() {
    getAllTables();
  });
}

function getAllTables(){
  var route = "connector.entryHandler.getAllExistingTables";
  var allChannels = [];
  pomelo.request(route, {}, function(tables) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' All table details - ' + JSON.stringify(tables));
    for (var i = 0; i < tables.rooms.length; i++) {
      console.log("--------------------------------( CHANNEL "+(i+1)+" )---------------------------------");
      pomelo.request("connector.entryHandler.getChannelsOfRoom", {tableReference: tables.rooms[i]._id}, function(channels) {
        var time = new Date();
        var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
        // console.log('\setTimen'++'  tables - ' + JSON.stringify(channels));
        for (var j = 0; j < channels.channels.length; j++) {
          allChannels.push(channels.channels[j]);
        };
      });
    };

     setTimeout(function(){
      var counter = 0;
      var joinInterval = setInterval(function(){
        if(parseInt(counter) < allChannels.length) {
        // if(parseInt(counter) < 1) {
          var time = new Date();
          var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
          console.log('\n'+setTime+' Joining channel - ' + (counter+1));
          // console.log(allChannels);
          getBotProfile(allChannels[counter]._id, function(profile){
            // console.log('profile - ' + JSON.stringify(profile));
            var botPlayerName = names[Math.floor(Math.random() * names.length)];
            console.log(_ld.pluck(totalBotProfiles, "channelId"));
            var basicArgs = {
              channelId       : null,
              playerId        : null,
              playerName      : "Hum Hoon PK",
              buyInAmount     : 500,
              amount          : 50,
              sidPlayer       : -1,
              playerSeatIndex : 0,
              playerState     : null,
              isStandUp       : true,
              isHighCard      : false,
              totalMoves      : 0,
              totalBlind      : 0,
              totalChaal      : 0,
              maxChaalLimit   : 0,
              maxBlindLimit   : 0,
              seenCards       : false,
              totalPlayers    : 0
            };
            botProfileArgs.playerName = botPlayerName;
            console.log('before');
            totalBotProfiles.push(basicArgs);
            var time = new Date();
            var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            console.log('\n'+setTime+' Total bot length - ' + totalBotProfiles.length);
            totalBotProfiles[totalBotProfiles.length-1].channelId = profile.channelId;
            totalBotProfiles[totalBotProfiles.length-1].playerId  = profile.player.playerToken;
            console.log('after');
            console.log(_ld.pluck(totalBotProfiles, "channelId"));
            joinTable(totalBotProfiles[totalBotProfiles.length-1], function(){
              counter++;
            });
          });
        } else {
          clearInterval(joinInterval);
        }
      }, 1000);
     }, 2000);
  });
}

function getBotProfile(channelId, cb){
  var route = "database.dbHandler.verifyLoginDetail";
  var playerId = "V1IDiIODe";
  pomelo.request(route, {playerId:"V1IDiIODe", playerMobile: "0101010101", playerPassword: "1234"}, function(botProfile) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    // console.log('\setTimen'++' Profile details of Bot - ' + JSON.stringify(botProfile));
    botProfile.channelId = channelId;
    cb(botProfile);
  });
}

function joinTable(player, cb){
  var time = new Date();
  var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  console.log('\n'+setTime+' Joining table - ' + JSON.stringify(player));
  var route = "connector.entryHandler.joinChannel";
  pomelo.request(route, player, function(botProfile) {
    getTableObject(player.channelId, function(){});
    // sitBotInChannel(player);
    cb();
  });
}

function sitBotInChannel(channelId){
  var route = "connector.entryHandler.sitHere";
  getMyBot(channelId, function(botPlayer){
    var botPlayerName = names[Math.floor(Math.random() * names.length)];
    botPlayer.playerName = botPlayerName;
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' response sitBotInChannel - ' + JSON.stringify(response));
    });
  });
}

function getMyBot (channelId, cb) {
  console.log('in getMyBot for channelId - ' + channelId);
  // console.log(totalBotProfiles);
  // console.log(_ld.where(totalBotProfiles, {channelId: channelId}));
  cb(_ld.where(totalBotProfiles, {channelId: channelId})[0]);
}

function botPack (channelId) {
  var route = "connector.entryHandler.playerPack";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' response botPack - ' + JSON.stringify(response));
    });
  });
}

function botBlind (channelId, amount){
  var route = "connector.entryHandler.playBlind";
  getMyBot(channelId, function(botPlayer){
    botPlayer.amount = parseInt(amount);
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' response botBlind - ' + JSON.stringify(response));
      _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalBlind = _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalBlind + 1;
    });
  });
}

function botChaal (channelId, amount){
  var route = "connector.entryHandler.playChaal";
  getMyBot(channelId, function(botPlayer){
    botPlayer.amount = parseInt(amount);
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' Bot player card seen status - ' + botPlayer.seenCards);
    if(botPlayer.seenCards) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot player have seen the cards already!')
      pomelo.request(route, botPlayer, function(response) {
        var time = new Date();
        var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' response botChaal - ' + JSON.stringify(response));
        _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalChaal = _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalChaal + 1;
      });
    } else {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot player have not seen cards yet!')
      setTimeout(function(){
        botCardSee(channelId, function(botSeenCard){
          setTimeout(function(){
            pomelo.request(route, botPlayer, function(response) {
              var time = new Date();
              var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            console.log('\n'+setTime+' response botChaal - ' + JSON.stringify(response));
              _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalChaal = _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalChaal + 1;
            }); 
          }, 2000);
        });
      }, 3000);
    }
  });
}

function botCardSee (channelId, cb) {
  var route = "connector.entryHandler.seeCards";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' response botCardSee - ' + JSON.stringify(response));
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot player have seen the cards now !')
      _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].seenCards = true;
      cb()
    });
  });
}

function botShow (channelId) {
  var route = "connector.entryHandler.playerShow";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' response botCardSee - ' + JSON.stringify(response));
    });
  });
}

function botStandUp (channelId) {
  var route = "connector.entryHandler.leaveChannel";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' response leaveChannel - ' + JSON.stringify(response));
    });
  });
}

function botCompareCard (channelId) {
  var route = "connector.entryHandler.botCompareCard";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' response botCompareCard - ' + JSON.stringify(response));
      if(response.winnerId != botPlayer.playerId) {
        botSetIsHighCard(botPlayer.playerId, false);
      } else {
        botSetIsHighCard(botPlayer.playerId, true);
      }
    });
  });
}

function setBotBLindAndChaalLimit (channelId) {
  getMyBot(channelId, function(botPlayer){
    var random = 0;
    random = (Math.floor(Math.random() * (4 - 2 + 0)) + 1);
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].maxChaalLimit = random;
    random = (Math.floor(Math.random() * (4 - 2 + 0)) + 1);
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].maxBlindLimit = random;
  });
}

function botSetIsHighCard (botPlayerId, isHighCard) {
  var time = new Date();
  var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  console.log('\n'+setTime+' Set bot player card strength as - ' + isHighCard);
  _ld.where(totalBotProfiles, {playerId: botPlayerId})[0].isHighCard = isHighCard;
}

function getTableObject (channelId, cb) {
  var route = "connector.entryHandler.getTableObject";
  getMyBot(channelId, function(botPlayer){
    pomelo.request(route, botPlayer, function(response) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' response getTableObject - ' + JSON.stringify(response));
      table = response;
      cb(table)
    });
  });
}

function checkBotMove (channelId, nextPlayerId, currentBlindAmt) {
  getMyBot(channelId, function(botPlayer){
    if(botPlayer.playerId == nextPlayerId) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot has the first move!');
      var afterSec = (Math.floor(Math.random() * (11 - 2 + 1)) + 2)*1000;
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot will make a move after second - ' + afterSec + ' with amount - ' + currentBlindAmt);
      setTimeout(function(){
        botBlind(table.channelId, currentBlindAmt);
      }, parseInt(afterSec))
    }
  });
}

function checkBotMoveCondition (table, data, botPlayer) {
  var time = new Date();
  var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  console.log('\n'+setTime+' Total blind for bot - ' + botPlayer.totalBlind);
  var time = new Date();
  var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  console.log('\n'+setTime+' Total chaal for bot - ' + botPlayer.totalChaal);
  var random = (Math.floor(Math.random() * (11 - 2 + 1)) + 1);
  if(botPlayer.isHighCard) {
    if(parseInt(botPlayer.totalChaal) > -1 && parseInt(botPlayer.totalChaal) < parseInt(botPlayer.maxChaalLimit)) {
      botChaal(table.channelId, table.lastChaalAmt);
    } else {
      botShow(table.channelId);
    }
  } else {
    if(parseInt(botPlayer.totalBlind) > -1 && botPlayer.totalBlind < parseInt(botPlayer.maxBlindLimit)) {
      botBlind(table.channelId, table.lastBlindAmt);
    } else {
      if(random%2 == 0) {
        botShow(table.channelId);
      } else {
        botPack(table.channelId);
      }
    }
  }
}

function makeBotMove (data) {
  getMyBot(data.channelId, function(botPlayer){
    console.log('botPlayer - ' + JSON.stringify(botPlayer));
    if(botPlayer.playerId != data.playerId && data.moveType != statesOfX.playerMoves.pack &&  data.moveType != statesOfX.playerMoves.show && data.nextPlayerMove == botPlayer.playerId) {
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' makeBotMove - ' + JSON.stringify(data))
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Real player make a move - ' + data.moveType);
      if(!!turnTimeout) {
        clearTimeout(turnTimeout);
      }
      var afterSec = (Math.floor(Math.random() * (7 - 2 + 1)) + 2)*1000;
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' Bot will make a move after second - ' + afterSec);
      setTimeout(function(){
        getTableObject(data.channelId, function(table){
          if(table.channelStatus == statesOfX.tableStatus.gameIsOn) {
            checkBotMoveCondition(table, data, botPlayer);
          }
        })
      }, parseInt(afterSec))
    }
  });
}

function resetBot (channelId) {
  // console.log('in reset bot - ' + JSON.stringify(data));
  getMyBot(channelId, function(botPlayer){
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalChaal = 0;
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalBlind = 0;
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].seenCards  = false;
  });
}

function updateTotalPlayers(channelId, count) {
  getMyBot(channelId, function(botPlayer){
    console.log('botPlayer - ' + JSON.stringify(botPlayer));
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].totalPlayers  = count;
  });
}

function sitOrStandUpBotPlayer (channelId, count, lastSitPlayerId) {
  getMyBot(channelId, function(botPlayer){
    console.log('botPlayer - ' + JSON.stringify(botPlayer));
    
    if(parseInt(botPlayer.totalPlayers) == 1) { // Bot will join the channel
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' There is one player in the game, sit a bot!');
      if(!!botSitTimer) {
        clearTimeout(botSitTimer);
      }

      if(lastSitPlayerId != botPlayer.playerId){
        botSitTimer = setTimeout(function(){
          sitBotInChannel(channelId);
        }, 2500);
      }
      updateTotalPlayers(channelId, count);
      checkIfOnlyBotSit(channelId)
    } else if (parseInt(botPlayer.totalPlayers) > 2) { // Bot will standup
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' There is more than 1 real player in game, stand up bot!');
      if(!!botSitTimer) {
        clearTimeout(botSitTimer);
      }
      botSitTimer = setTimeout(function(){
        botStandUp(channelId);
      }, 2000);
    } else {
      if(!!botSitTimer) {
        clearTimeout(botSitTimer);
      }
      var time = new Date();
      var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      console.log('\n'+setTime+' There is some error in botPlayerCount broadcast !');
    }
  });
}

function checkIfOnlyBotSit (channelId) {
  getMyBot(channelId, function(botPlayer){
    console.log('botPlayer - ' + JSON.stringify(botPlayer));
    getTableObject(channelId, function(table){
      if(table.playerPosition.length == 1) {
        if(botPlayer.playerId == table.playerPosition[0].playerId) {
          if(!!botSitTimer) {
            clearTimeout(botSitTimer);
          }
          botSitTimer = setTimeout(function(){
            botStandUp(channelId);
          }, 2000);
        }
      }
    });
  });
}

function updateBotPlayerIndex (data) {
  getMyBot(data.channelId, function(botPlayer){
    console.log('botPlayer - ' + JSON.stringify(botPlayer));
    var newIndex = data.playerSeatIndex + 1;
    newIndex = newIndex >= 5 ? newIndex-1 : newIndex;
    console.log('Bot wil sit at index - ' + newIndex);
    _ld.where(totalBotProfiles, {playerId: botPlayer.playerId})[0].playerSeatIndex  = newIndex;
  });
}

var listenBroadcasts =  function () {
  pomelo.on("playerSeated", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' playerSeated broadcast - ' + JSON.stringify(data))
    updateBotPlayerIndex(data);
  });

  pomelo.on("gameOver", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' gameOver broadcast - ' + JSON.stringify(data))
    if(data.count >= 3) {
      if(!!botSitTimer) {
        clearTimeout(botSitTimer);
      }
      botSitTimer = setTimeout(function(){
        botStandUp(data.channelId);
      }, 2000);
    } else {
      resetBot(data.channelId);
      updateTotalPlayers(data.channelId, data.count);
    }
  });

  pomelo.on("playerTurn", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' playerTurn broadcast - ' + JSON.stringify(data))
    makeBotMove(data)
    sitOrStandUpBotPlayer(data.channelId, 0, "");
  });

  pomelo.on("cardSeen", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' cardSeen broadcast - ' + JSON.stringify(data))
  });


  // Handle sit and stand up conditions for bot player
  pomelo.on("botPlayerCount", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' botPlayerCount broadcast - ' + JSON.stringify(data))
    updateTotalPlayers(data.channelId, data.count);
    sitOrStandUpBotPlayer(data.channelId, data.count, data.playerId);
  });

  // Check bot player has high card than real player or ,not
  pomelo.on("gameStarted", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' gameStarted broadcast - ' + JSON.stringify(data));
  });

  pomelo.on("botMove", function(data) {
    var time = new Date();
    var setTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    console.log('\n'+setTime+' botMove broadcast - ' + JSON.stringify(data));
    botCompareCard(data.channelId);
    setBotBLindAndChaalLimit(data.channelId);
    checkBotMove(data.channelId, data.playerMoveId, data.currentBlindAmt);
  });

}

listenBroadcasts()

// request server for existing number of table
// invoke that many player and join in them on each table
// all player will wait for bot specific broadcast from server to sit.
// on recieving broadcast bot will play as normal player !!


sendRequest("/", "GET", "", function(){
});

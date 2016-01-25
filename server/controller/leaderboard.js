'use strict';

var mongoose = require('mongoose'),
    leaderboard = mongoose.model('leaderboard'),
    gameinfo = require('../config/config').gameinfo;

var leaderboardController = {};

/**
   GET: /leaderboard
 */

leaderboardController.getAll = function (req,res,next) {
  console.log("Request for GET leaderboard : ");
    var query = {
        gameId: gameinfo.gameId,
        gameName: gameinfo.gameName
    }
    leaderboard.getAll(query, function(err, result) {
      if (!err) {
          return res.json({status:true, result: result});
      } else {
          return res.json({status:false, result:"Unable to get list"});
      }
    });
};


/**
   POST: /leaderboard
 */

leaderboardController.create = function (req,res,next) {
  console.log("Request for create leaderboard : " + JSON.stringify(req.body));
    req.body.gameId = gameinfo.gameId;
    req.body.gameName = gameinfo.gameName;
    leaderboard.createleaderboard(req.body, function(err, result) {
        if (!err) {
            return res.json({status:true,result: "Successfully updated"});
        } else {
            return res.json({status:false,info:"Unable to update"});
        }
    });
};

module.exports = leaderboardController;



'use strict';

var mongoose = require('mongoose'),
    leaderboard = mongoose.model('leaderboard');



/**
   GET: /leaderboard
 */

exports.getAll = function (req,res,next) {
  console.log("Request for GET leaderboard : ");
    var query = {
        gameId: "gameId",
        gameName: "gameName"
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

exports.create = function (req,res,next) {
  console.log("Request for create leaderboard : " + JSON.stringify(req.body));
    req.body.gameId = "gameId";
    req.body.gameName = "gameName";
    leaderboard.createleaderboard(req.body, function(err, result) {
        if (!err) {
            return res.json({status:true,result: "Successfully updated"});
        } else {
            return res.json({status:false,info:"Unable to update"});
        }
    });
};


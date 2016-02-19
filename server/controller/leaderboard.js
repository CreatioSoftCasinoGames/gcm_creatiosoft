'use strict';

var mongoose = require('mongoose'),
    leaderboard = mongoose.model('leaderboard');

var leaderboardController = {};

/**
   GET: /leaderboard
 */

leaderboardController.getAll = function (req,res,next) {
    leaderboard.getAll(function(err, result) {
      if (!err) {
          return res.json({status:true, result: result});
      } else {
          return res.json({status:false, result:"Unable to get list"});
      }
    });
};

/**
   GET: /leaderboard/level
 */

leaderboardController.getByLevel = function (req,res,next) {
    leaderboard.getByLevel(req.params.level, function(err, result) {
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
    if(!!req.body.userId || !!req.body.userName || !!req.body.level || !!req.body.timeElapsed){
        if(!!!req.body.userName){
            req.body.userName = makeid();
        }
      leaderboard.createleaderboard(req.body, function(err, result) {
        if (!err) {
            return res.json({status:true,result: "Successfully updated"});
        } else {
            return res.json({status:false,info:"Unable to update"});
        }
      });
    }
    else
      return res.json({status:false,info:"insufficient info"});    
};

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports = leaderboardController;



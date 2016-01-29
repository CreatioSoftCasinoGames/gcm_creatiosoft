'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('user');

var userController = {};

/**
   GET: /user
 */

userController.getAllUser = function (req,res,next) {
  console.log("Request for GET leaderboard");
    user.getAllUser(function(err, result) {
      if (!err) {
          return res.json({status:true, result: result});
      } else {
          return res.json({status:false, result:"Unable to get list"});
      }
    });
};


/**
   POST: /user
 */

userController.createUser = function (req,res,next) {
  console.log("Request for create leaderboard : " + JSON.stringify(req.body));
    user.createUser(req.body, function(err, result) {
        if (!err) {
            return res.json({status:true,result: "Successfully created"});
        } else {
            return res.json({status:false,info:"User already registered"});
        }
    });
};

module.exports = userController;
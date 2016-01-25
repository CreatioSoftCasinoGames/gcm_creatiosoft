'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
  * @module  User
  * @description contain the details of user  
*/

var leaderboard = new Schema({
  
  /** 
    Game ID. It can only contain string, is required and unique field which is indexed.
  */
  gameId : { type: String, unique: true },

  gameName: String,

  top3Rank: [{

      name: String,

      rank: Number,

      trackName: String
  }]
  
});


leaderboard.statics.getAll= function(query, callback) {
    this.findOne(query, callback);
};

leaderboard.statics.createleaderboard = function(requestData, callback) {
    this.update({gameId: requestData.gameId}, requestData, {upsert: true}, callback);
};

mongoose.model('leaderboard', leaderboard);
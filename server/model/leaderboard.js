'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var leaderboard = new Schema({
  
  /** 
    Game ID. It can only contain string, is required and unique field which is indexed.
  */
  userId : String,

  userName: String,

  level: Number,

  timeElapsed: Number  
  
});


leaderboard.statics.getByLevel= function(level, callback) {
    this.find({level: level}).sort({timeElapsed : 1}).limit(3).exec(callback);
};

leaderboard.statics.getAll= function(callback) {
    this.find({}, callback);
};

leaderboard.statics.createleaderboard = function(requestData, callback) {
    this.create(requestData, callback);
};

mongoose.model('leaderboard', leaderboard);
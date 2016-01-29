'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var top10player = new Schema({
  
  /** 
    Game ID. It can only contain string, is required and unique field which is indexed.
  */
  gameId : { type: String, unique: true },

  gameName: String,

  date: Number,

  top10playerTrack1: [{

      name: String,

      time: Number,

      trackName: String

  }],

  top10playerTrack2: [{

      name: String,

      time: Number,

      trackName: String

  }],

  top10playerTrack3: [{

      name: String,

      time: Number,

      trackName: String
  }]

});


top10player.statics.getAll= function(query, callback) {
    this.findOne(query, {"top10player._id": 0}, callback);
};

top10player.statics.createtop10player = function(requestData, callback) {
    this.update({gameId: requestData.gameId}, requestData, {upsert: true}, callback);
};

mongoose.model('top10player', top10player);
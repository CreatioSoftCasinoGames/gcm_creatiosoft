'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var bingoAdd = new Schema({
  
  paid: {

    lobbyAdd : {

      level: Number,

      ticket: { type: Number, default: 0},

      coin: { type: Number, default: 0},

      power: { type: Number, default: 0},

      cap: Number
    },

    dailyBonus: {

      level: Number,

     ticket: { type: Number, default: 0},

      coin: { type: Number, default: 0},

      power: { type: Number, default: 0},

    }

  },

  unpaid : {

    lobbyAdd : {

      level: Number,

     ticket: { type: Number, default: 0},

      coin: { type: Number, default: 0},

      power: { type: Number, default: 0},

      cap: Number
    },

    dailyBonus: {

      level: Number,

      ticket: { type: Number, default: 0},

      coin: { type: Number, default: 0},

      power: { type: Number, default: 0},
    }
  }
  
});


bingoAdd.statics.getPaidUnpaid = function(callback) {
    this.findOne({}, callback);
};

bingoAdd.statics.createPaidUnpaid = function(requestObject, callback) {
    requestObject.save(callback);
};

mongoose.model('bingoAdd', bingoAdd);
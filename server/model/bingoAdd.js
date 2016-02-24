'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var bingoAdd = new Schema({
  
  paid: {

    level: Number,

    ticket: Number,

    coin: Number,

    power: Number,

    caps: Number

  },

  unpaid: {

    level: Number,

    ticket: Number,

    coin: Number,

    power: Number,

    caps: Number
  }
  
});


bingoAdd.statics.getPaidUnpaid = function(callback) {
    this.findOne({}, callback);
};

bingoAdd.statics.createPaidUnpaid = function(requestObject, callback) {
    requestObject.save(callback);
};

mongoose.model('bingoAdd', bingoAdd);
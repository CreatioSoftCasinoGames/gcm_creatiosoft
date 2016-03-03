'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var iapBundle = new Schema({
  
  levelStart: { type: Number },

  levelEnd: { type: Number },

  packName: { type: String },

  originalPrice: { type: Number },

  newPrice: { type: Number },

  skuId: { type: String },

  dealStartDateTime: { type: Number },

  dealEndDateTime: { type: Number },

  purchaseLimit: { type: Number },

  discountPercent: { type: Number },

  items: {

      tickets : { type: Number, default: 0 },

      coins : { type: Number, default: 0 },

      powerUps: { type: Number, default: 0 },

      scratchers : { type: Number, default: 0 },

      keys : { type: Number, default: 0 },

      wheelSpins: { type: Number, default: 0 },
  }
  
});

iapBundle.statics.getAlliap = function(callback) {
    this.find({}, callback);
};

iapBundle.statics.getiap = function(level, type, callback) {
    this.findOne({packName: type, levelStart: { $lte: level }, levelEnd: { $gte: level }}, callback);
};

iapBundle.statics.chekiapExistByLevelRange = function(type, levelStart, levelEnd, callback) {
    this.find({packName: type,levelStart: { $lte: levelStart }, levelEnd: { $gte: levelEnd }}, callback);
};

iapBundle.statics.createiap = function(requestObject, callback) {
    this.create(requestObject, callback);
};

mongoose.model('iapBundle', iapBundle);
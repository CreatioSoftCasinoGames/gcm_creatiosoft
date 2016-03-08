'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
   var  ObjectId = Schema.ObjectId;

var iapBundle = new Schema({

  packType: { type: String },
  
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

iapBundle.statics.getAlliapByType = function(type, callback) {
    this.find({packType: type}).sort('levelStart').exec(callback);
};

iapBundle.statics.getiap = function(level, type, callback) {
    this.findOne({packType: type, levelStart: { $lte: level }, levelEnd: { $gte: level }}, callback);
};

iapBundle.statics.chekiapExistByLevelRange = function(type, ulevelStart, ulevelEnd, callback) {
  this.find({packType: type,$or:[{$and:[{levelStart: { $lte: ulevelStart}},{levelEnd: { $gte: ulevelStart}}]},
    {$and:[{levelStart: { $lte: ulevelEnd}},{levelEnd: { $gte: ulevelEnd}}]}]}, callback);
};

iapBundle.statics.checkForRange = function(type, ulevelStart, ulevelEnd, callback) {
  this.find({packType: type,$and: [{levelStart: { $gte: ulevelStart}},{levelEnd: { $lte: ulevelEnd}}]}, callback);
};

iapBundle.statics.createiap = function(requestObject, callback) {
    this.create(requestObject, callback);
};

iapBundle.statics.getUpdateEntry = function(bundleId, callback) {
  this.find({_id: bundleId}, callback);
};

iapBundle.statics.removeUpdateEntry = function(bundleId, callback) {
  this.remove({_id: bundleId}, callback);
};


mongoose.model('iapBundle', iapBundle);
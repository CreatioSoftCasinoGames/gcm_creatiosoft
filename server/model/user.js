'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var user = new Schema({

  emailId : { type: String, unique: true },

  name: String
  
});


user.statics.getAllUser= function(callback) {
    this.find({}, callback);
};

user.statics.createUser = function(requestData, callback) {
    this.create(requestData, callback);
};

mongoose.model('user', user);
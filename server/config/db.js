'use strict';

var Mongoose = require('mongoose'); 
var config = require('./config');

Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);  
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));  
db.once('open', function callback() {  
    console.log("Connection with database succeeded.");
    //require('../model/leaderboard');
});

exports.Mongoose = Mongoose;  
exports.db = db;  

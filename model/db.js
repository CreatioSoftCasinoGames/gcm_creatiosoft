/**
 * Created by prateek on 7/6/16.
 */
var mongoose = require( 'mongoose' );
var config = require('../config');
// default to a 'localhost' configuration:
var connection_string = config.host+":"+config.port+'/casinogames';
// if OPENSHIFT env variables are present, use the available connection info:
console.log(connection_string);
// Create the database connection
mongoose.connect(connection_string);

// Define connection events
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + connection_string);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var player =  new mongoose.Schema({
    name            :   {type:"String"},
    emailId         :   {type:"String"},
    mobNo           :   {type:"Number"},
    uniqueToken     :   {type:"String"},
    password        :   {type:"String"},
    joinedFromGame  :   {type:"String"},
    noOfChips       :   {type:"Number"},
    noOfSips        :   [mongoose.Schema.Types.Mixed],
    handsPlayed     :   {type:"Number"},
    handsWon        :   {type:"Number"},
    createdOn       :   {type:"Number"},
    isLoggedIn      :   {type:"Boolean",default:false},
    lastUpdateOn    :   {type:"Number"}
});
player.index({uniqueToken:1});
player.index({emailId:1});
mongoose.model('player',player);

var playerLoggingHistory = new mongoose.Schema({
    emailId         : {type:"String"},
    eventType       : {type:"String"}, // login or logout
    walletAmount    : {type:"Number"},
    gameName        : {type:"String"},
    attempt         : {type:"String"}, // only 2 either successful or failed
    createdOn       : {type:"String"}
});
playerLoggingHistory.index({emailId:1});
mongoose.model('playerLoggingHistory',playerLoggingHistory);

var videoList = new mongoose.Schema({
    gameName : {type:"String"},
    fileName : {type:"String"},
    lastUpdated : {type:"Number"}
});
playerLoggingHistory.index({gameName:1});
mongoose.model('videoList',videoList);
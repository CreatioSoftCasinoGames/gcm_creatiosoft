/**
 * Created by prateek on 3/11/15.
 */
var mongoose = require( 'mongoose' );
// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/teenpatti';
// if OPENSHIFT env variables are present, use the available connection info:
console.log(connection_string);
console.log("****************************");
console.log("****************************");
console.log("*****************************");
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

var chat =  new mongoose.Schema({
    name    : {type:"String"},
    message : {type:"String"}
});
mongoose.model('chat',chat);



//collection to hold player's !!
var playerInfo = new mongoose.Schema({
    playerToken       : {type:"String"},
    playerName        : {type:"String"},
    playerEmail       : {type:"String"},
    playerAvatarId    : {type:"String"},
    playerMobile      : {type:"Number"},
    isEnabled         : {type:"Boolean",default:false},
    playerPassword    : {type:"String"}, // use encryption to encrypt password !!
    agentId           : {type:"String"},
    playerRefForAdmin : {type:"String"},
    lastLoginIp       : {type:"String"}, // need to sort out the way
    loginAt           : {type:"Number"},
    lastLogin         : {type:"Number"},
    isBot             : {type:"Boolean",default:false}
});
playerInfo.index({playerToken:1});
playerInfo.index({playerMobile:1});
playerInfo.index({playerRefForAdmin:1});
mongoose.model('playerInfo',playerInfo);

//collection to hold player's account related Information !!
var playerAccount = new mongoose.Schema({
    playerToken : {type:"String"},
    totalCoins : {type:"Number"}
});
playerInfo.index({playerToken:1});
mongoose.model('playerAccount',playerAccount);

var playerAccountTransactionLogs = new mongoose.Schema({
    playerToken : {type:"String"},  // in case of player transaction this field will be acting as ledgerOf
    transStatus : {type:"String"},  // COMPLETE, PENDING etc
    transAmount : {type:"Number"},  // Amount
    transInit   : {type:"String"},  // Who was initiator
    transRcvr   : {type:"String"},  // beneficiary
    transTrfType: {type:"String"},  // Credit or Debit
    transId     : {type:"String"},  // short id
    transType   : {type:"String"},  // keyword of FNDTRF, WIDRWL, TIP, BOOT, RAKE, MOVE, POTWIN
    statement   : {type:"String"},    // remark
    channelId   : {type:"String"},    // channelId
    roundId     : {type:"String"},  // unique round allotted
    createdOn   : {type:"Number",default:new Date().getTime()}
});
playerAccountTransactionLogs.index({playerToken:1});
mongoose.model('playerAccountTransactionLogs',playerAccountTransactionLogs);

//game status maintenance and running
var gameState = new mongoose.Schema({
    state : {type:"String",default: "Running"},
    valid : {type:"Boolean",default: true}
});
gameState.index({state:1});
gameState.index({valid:1});
mongoose.model('gameState',gameState);

// collection to hold configuration of room types
// roomType and Table are same and client app knows this collection as table
var roomType = new mongoose.Schema({
    roomName          : {type:"String"},
    bootAmount        : {type:"Number"},
    minAllowed        : {type:"Number"},
    maxAllowed        : {type:"Number"},
    maxPlayer         : {type:"Number"},
    chaalLimit        : {type:"Number"},
    potLimit          : {type:"Number"},
    blindLimit        : {type:"Number"},
    tableInstance     : {type:"Number",default:3},
    liveTableInstance : {type:"Number",default:3}, // should be same as table instance
    playingPlayers    : {type:"Number"}
});
roomType.index({roomName:1});
mongoose.model('roomType',roomType);


// what will happens of admin change room type ?
// active room are considered as channel for client App
var activeTable = mongoose.Schema({
    roomTypeRef           : {type:mongoose.Schema.Types.ObjectId, ref:'roomType'},
    tableName             : {type:"String"},
    bootAmount            : {type:"Number"},
    minAllowed            : {type:"Number"},
    maxAllowed            : {type:"Number"},
    maxPlayer             : {type:"Number"},
    chaalLimit            : {type:"Number"},
    potLimit              : {type:"Number"},
    blindLimit            : {type:"Number"},
    isTableFull           : {type:"Boolean", default:false}, // is room full or vaccant !!
    playingPlayers        : {type:"Number",default:0},
    watchingPlayers       : {type:"Number",default:0},
    tableStatus           : {type:"String",default:"WAITING"},
    gameStartingNotiTime  : {type:"Number"}, // entry will be saved of time when server says game will be started !!,
    gapBWRounds           : {type:"Number",default:10},
    numberOfRoundsPlayed  : {type:"Number",default:0},
    currentPotAmt         : {type:"Number",default:0}
});
activeTable.index({roomName:1});
activeTable.index({roomTypeRef:1});
mongoose.model('activeTable',activeTable);

var subscribeForTable = mongoose.Schema({
    playerToken     : {type:"String"},
    channelId       : {type:"String"},
    createdOn       : {type:"Date",default:(new Date()).getTime()}
});
subscribeForTable.index({channelId:1});
subscribeForTable.index( {createdOn:1},{expireAfterSeconds:10800});
mongoose.model("subscribeForTable",subscribeForTable);

var playersOfActiveTable = mongoose.Schema({
    channelId           : {type:"String"},
    playerId            : {type:"String"},
    playerName          : {type:"String"},
    playerAmountOnTable : {type:"Number"},
    playerSittingPos    : {type:"String"},
    playerMode          : {type:"String"}, // is playing, standup mode, sitting not playing
    isCardSeen          : {type:"Boolean",default:false},
    isCardDistributed   : {type:"Boolean",default:false},
    cardsInHand         : [],
    playerState         : {type:"String"}, // PACK , CHAAL, ETC
    seatedAt            : {type:"Number"}
});
playersOfActiveTable.index({channelId:1});
playersOfActiveTable.index({playerId:1});
mongoose.model("playersOfActiveTable",playersOfActiveTable);


var flagDB = mongoose.Schema({
    whatFailed : {type:"String"}, // name of function
    functionArgs : {type :"String"}, // number of arguments
    createdOn : {type:"Number",default:new Date().getTime()}
});
flagDB.index({whatFailed:1});
flagDB.index({createdOn:-1});
mongoose.model("flagDB",flagDB);


var adminProfiles = mongoose.Schema({
    name            : {type:"String"},
    mobileNumber    : {type:"Number"},
    password        : {type:"String"},
    role            : {type:"String"},  // 100 Top management, 101 Top State, 102 Top District // 103 Agents
    state           : {type:"String",default:"ALL"},
    district        : {type:"String",default:"ALL"},
    area            : {type:"String",default:"ALL"},
    pincode         : {type:"Number"},
    adminWallet     : {type:"Number"},
    adminRefId      : {type:"String"},
    commission      : {type:"Number"},
    createdBy       : {type:"String"}
});
adminProfiles.index({mobileNumber:1});
adminProfiles.index({state:1});
adminProfiles.index({role:1});
adminProfiles.index({district:1});
adminProfiles.index({state:1,district:1});
adminProfiles.index({adminRefId:1});
mongoose.model("adminProfiles",adminProfiles);


//collection to hold player's account related Information !!


var adminProfilesWallet = new mongoose.Schema({
    adminRefId : {type:"String"},
    totalCoins : {type:"Number"}
});
adminProfilesWallet.index({playerToken:1});
mongoose.model('adminProfilesWallet',adminProfilesWallet);

/*****************************
 These collections are specifically for the other server !!
 */
// fundTransfer on game server will always be between agent and player
var fundTransfers = mongoose.Schema({
    fundAmount          : {type:"Number"},
    fundInitiator       : {type:"String"},
    fundReceiver        : {type:"String"},
    fundStatus          : {type:"String"}, // like initiated completed etc
    fundRemark          : {type:"String"},
    fundTransferType    : {type:"String"},
    fundTransferId      : {type:"String"},
    fundType            : {type:"String"}, // keyword of FNDTRF, WIDRWL, TIP, BOOT, RAKE, COMM, POTWIN, MOVE
    createdOn           : {type:"Number",default: (new Date()).getTime()},
    ledgerOf            : {type:"String"} // Id to be linked with
});
fundTransfers.index({fundInitiator:1});
fundTransfers.index({fundReceiver:1});
fundTransfers.index({fundStatus:1});
fundTransfers.index({createdOn:-1});
mongoose.model("fundTransfers",fundTransfers);

// fun
var withdrawal = mongoose.Schema({
    withdrawalId        : {type:"String"},
    withdrawalAmt       : {type:"Number"},
    withdrawalInit      : {type:"String"},
    withdrawalResp      : {type:"String"},
    status              : {type:"String"}, //PENDING, ACCEPTED, REJECTED
    createdOn           : {type:"Number",default: (new Date()).getTime()}
});
withdrawal.index({withdrawalId:1});
withdrawal.index({withdrawalInit:1});
withdrawal.index({withdrawalResp:1});
withdrawal.index({createdOn:-1});
mongoose.model("withdrawal",withdrawal);

/*
Schedule maintainance !!
 */

var testColl = mongoose.Schema({
    col1 : {type:"String"},
    col2 : {type:"String"},
    amount : {type:"Number"},
    uniqueId : {type:"String"}
});
mongoose.model("testColl",testColl);
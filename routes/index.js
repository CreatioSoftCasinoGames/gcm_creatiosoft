var express = require('express');
var router = express.Router();
var utility = require("../models/utility")();
var sys = require('sys');
var exec = require('child_process').exec;
//var pomelo  = require('../../game-server/node_modules/pomelo/bin/pomelo');
var _ = require('underscore');

// var shortId = require("shortid");
// var mongoose = require("mongoose");
// var playerCollection = mongoose.model("playerInfo");
// var playerAccount = mongoose.model("playerAccount");
// var playerAccountTransactionLogs = mongoose.model("playerAccountTransactionLogs");

var playerManagement = require("./playerRestration");
var tableManagement = require("./tableSettingMgmnt");
var gameStateMgmt = require("./gameStateManagement");
var thirdPartyService = require("./adminSrvrSyncService");
var analytics = require("./analytics");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', gateHost: req.app.get('config').gateHost, gatePort: req.app.get('config').gatePort });
});

router.post("/dropBetweenRangeOfAdmin", function(req,res){
    analytics.getDropBetweenRangeOfAdmin(req, res);
});

router.post("/dropBetweenRangeOfAdminFromAgent", function(req,res){
    analytics.getDropBetweenRangeOfAdminFromAgent(req, res);
});

router.get("/getTop20PlayerDropWithAgent", function(req,res){
    analytics.getTop20PlayerDropWithAgent(req, res);
});

router.post("/getTop10PlayerDropForParticularAgent", function(req,res){
    analytics.getTop10PlayerDropForParticularAgent(req, res);
});

router.post("/getGetTipAmountByAdmin", function(req,res){
    analytics.getGetTipAmountByAdmin(req, res);
});

router.post("/getAllTransactionForAgent", function(req,res){
    analytics.getAllTransactionForAgent(req, res);
});

router.post("/signin",function(req,res){
    thirdPartyService.verifyLogin(req,res);
});

router.post("/createagent",function(req,res){
    thirdPartyService.createAgent(req,res);
});

router.post("/fundtransfer",function(req,res){
    thirdPartyService.transferFund(req,res);
});

router.post("/getGameState",function(req,res){
    console.log('Getting game state request !');
    gameStateMgmt.getGameState(req,res);
});

router.post('/registerplayer', function(req, res) {
	playerManagement.registerPlayer(req,res);
});

router.post("/getnewplayers",function(req,res){
    console.log("getEnabledPlayers " + JSON.stringify(req.body));
    thirdPartyService.getNewPlayers(req,res);
});

router.post("/getenabledplayer",function(req,res){
    thirdPartyService.getEnabledPlayers(req,res);
});

router.post("/toggleplayingstatus",function(req,res){
    thirdPartyService.togglePlayerStatus(req,res);
});

router.post("/resetpassword",function(req,res){
    thirdPartyService.passwordChange(req,res);
});

router.post("/getbasictable",function(req,res){
    tableManagement.getAllRooms(req,res);
});

router.post("/updatenewroomconfig",function(req,res){
    tableManagement.updateRoomConfiguration(req,res);
});

router.post("/getadminacc", function (req,res) {
    //playerManagement.getAdminAccountDetail(req,res);
    thirdPartyService.getCompanyAccountInfo(req,res);
});

router.post("/getaccountbal", function (req,res) {
    //playerManagement.getAdminAccountDetail(req,res);
    thirdPartyService.getCompanyAccountInfo(req,res);
});

router.post("/createnewmember", function (req,res) {
    console.log("createnewmember received !!");
    thirdPartyService.newMember(req,res);
});

router.post("/updatememberinfo",function(req,res){
    thirdPartyService.updateMemberInfo(req,res);
});

router.post("/updateaccount", function (req,res) {
    if(req.body.fundTrfType == "WIDRWL") {
        req.body.amount = req.body.memberAmount;
        req.body.from = req.body.fundInitiator;
        thirdPartyService.createWithdrawFund(req,res);
    } else {
        thirdPartyService.updateWallet(req,res);
    }

});

router.post("/getplayerwallet",function(req,res){
    console.log("Request received for : getplayerwallet");
    thirdPartyService.getPlayerAccount(req,res);
});

router.post("/genauthtoken",function(req,res){
    thirdPartyService.generateAuthToken(req,res);
});

router.post("/maintenance",function(req,res){
    thirdPartyService.generateAuthToken(req,res);
});

router.post("/getacctransactions",function(req,res){
    console.log("Request received for : getacctransactions");
    thirdPartyService.getTransactionRecords(req,res);
});

router.post("/withdrawfund",function(req,res){
    console.log("Request received for : withdrawfund");
    thirdPartyService.createWithdrawFund(req,res);
});

router.post("/getwithdrawhist",function(req,res){
    console.log("Request received for : getwithdrawhist");
    thirdPartyService.withdrawFundHist(req,res);
});

router.post("/getpendingwithdrw",function(req,res){
    console.log("Request received for : getpendingwithdrw");
    thirdPartyService.pendingWithdrawal(req,res);
});

router.post("/togglewithdrawstatus",function(req,res){
    console.log("Request received for : togglewithdrawstatus");
    thirdPartyService.toggleWithdrawal(req,res);
});

router.post("/listagent",function(req,res){
    console.log("Request received for : listagent");
    thirdPartyService.listAgents(req,res);
});

router.post("/getdrop",function(req,res){
    thirdPartyService.getDrop(req,res);
});

module.exports = router;
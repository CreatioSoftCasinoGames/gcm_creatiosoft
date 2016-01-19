/**
 * Created by prateek on 15/11/15.
 */

/*
var mongoose = require("mongoose");
var playerCollection = mongoose.model("playerInfo");
var playerAccount = mongoose.model("playerAccount");
*/
var shortId = require("shortid");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var playerCollection = mongoose.model("playerInfo");
var playerAccount = mongoose.model("playerAccount");
var playerAccountTransactionLogs = mongoose.model("playerAccountTransactionLogs");
var adminProfiles = mongoose.model("adminProfiles");

var playerRegistration = {};

function updateTransactionLog(token,statement){
    var transaction = new playerAccountTransactionLogs();
    transaction.playerToken = token;
    transaction.statement = statement;
    transaction.save(function(err,savedValue){
        if(!err && savedValue){
            console.log("updateTransactionLog : Transaction saved successfully !!");
        } else {
            console.log("updateTransactionLog : could not save transaction !!");
        }
    });
}

function createPlayerAccount(token){
    var newAcc = new playerAccount();
    newAcc.playerToken = token;
    newAcc.totalCoins = 500000;
    newAcc.save(function(err){
        if(err){
            console.log("Error in creating new Account for player token " + token);
        }
    });
};

playerRegistration.registerPlayer = function(req,res){
    console.log("Request received for registerPlayer : " + JSON.stringify(req.body));
    if(req.body.playerName != "" && req.body.playerMobile != "" && req.body.playerPassword != "" && req.body.agentId != ""){
        playerCollection.findOne({playerMobile: req.body.playerMobile}, function (err, queryResult) {
            if (!err) {
                if (queryResult) {
                    console.log("Player seems to be registered !!");
                    res.json({
                        status: false, 
                        info: "User already registered on server, please contact your agent !!"
                    });
                } else if (!queryResult) {
                    playerCollection.count({},function(err,countOfPlayer){
                        console.log('countOfPlayer - ' + countOfPlayer);
                        if(!err && countOfPlayer){
                            var newShortId = shortId.generate();
                            var newRegistration = new playerCollection();
                            newRegistration.playerToken = newShortId;
                            newRegistration.playerName = req.body.playerName;
                            newRegistration.playerMobile = req.body.playerMobile;
                            newRegistration.playerAvatarId = req.body.playerAvatarId;
                            newRegistration.playerPassword = req.body.playerPassword;
                            //newRegistration.agentId = req.body.agentId;
                            newRegistration.agentId = req.body.agentId;
                            newRegistration.isEnabled = false;
                            newRegistration.playerRefForAdmin = ("PL" + (1001 + countOfPlayer)); // first player will get code PL1001
                            newRegistration.save(function (err, savedResult) {
                                if (!err && savedResult) {
                                    createPlayerAccount(newShortId);
                                    console.log("Player profile created successfully !!");
                                    res.json({
                                        status: true,
                                        info: "New user information saved on server",
                                        playerInfo: savedResult
                                    });
                                } else {
                                    console.log("Error in registering new user !!" + err);
                                    res.json({status: false, info: "Error in registering new user !!"});
                                }
                            });
                        } else {
                            console.log("Error in registering new user !!" + err);
                            res.json({status: false, info: "Error in registering new user !!"});
                        }
                    });
                }
            } else {
                console.log("Error occured on server !!" + err);
                res.json({status: false, info: "Error occurred on server !!"});
            }
        });
    } else {
        console.log("Insufficient parameters to register user !!");
        res.json({status:false,info:"Insufficient parameters to register user !!"});
    }
};

playerRegistration.listAllEnabledPlayers = function(req,res){
    console.log(" playerRegistration.listAllEnabledPlayers request : " + JSON.stringify(req.body));
    var ll = !!req.body.lowerLimit ? req.body.lowerLimit : 0;
    var enabledPlayerQuery = playerCollection.find({isEnabled:true,playerMobile:{$gt:0}}); // to be copied in query agentId:req.body.memberCode
    enabledPlayerQuery.select("playerPassword playerMobile playerName playerToken isEnabled playerRefForAdmin");
    enabledPlayerQuery.sort("playerMobile");
    if(ll > 0){
        enabledPlayerQuery.skip(ll);
    }
    enabledPlayerQuery.limit(20);
    enabledPlayerQuery.exec(function(err,queryResult){
        if(!err){
            if(queryResult.length === 0 ){
                console.log("playerRegistration.listAllEnabledPlayers: length is equal to 0 ==> No player registered on server !!");
                res.json({status:false,info:"No player are enabled on server !!",nomoreentry:true});
            } else {
                if(queryResult.length < 20){
                    console.log("playerRegistration.listAllEnabledPlayers: length is less than 20 ==> Entries found on server !!");
                    res.json({status:true,info:"Entries found on server",nomoreentry:true,enabledPlayers : queryResult});
                } else {
                    console.log("playerRegistration.listAllEnabledPlayers: length is equal to 20 ==> Entries found on server !!");
                    res.json({status:true,info:"Entries found on server",nomoreentry:false,enabledPlayers : queryResult});
                }
            }
        } else {
            res.json({status:false,info:"error occurred while fetching entries from server !!"});
        }
    });
};

playerRegistration.listAllPendingToEnabledPlayers = function(req,res){
    console.log(" playerRegistration.listAllPendingToEnabledPlayers request : " + JSON.stringify(req.body));
    var ll = !!req.body.lowerLimit ? req.body.lowerLimit : 0;
    var newlyRegPlayerQuery = playerCollection.find({isEnabled:false,playerMobile:{$gt:0}});
    newlyRegPlayerQuery.select("playerPassword playerMobile playerName playerToken isEnabled playerRefForAdmin");
    newlyRegPlayerQuery.sort("playerMobile");
    if(ll > 0){
        newlyRegPlayerQuery.skip(ll);
    }
    newlyRegPlayerQuery.limit(20);
    newlyRegPlayerQuery.exec(function(err,queryResult){
        if(!err){
            if(queryResult.length === 0 ){
                console.log("playerRegistration.listAllPendingToEnabledPlayers: length is equal to 0 ==> No player registered on server !!");
                res.json({status:false,info:"No player registered on server !!",nomoreentry:true});
            } else {
                if(queryResult.length < 20){
                    console.log("playerRegistration.listAllPendingToEnabledPlayers: length is less than 20 ==> Entries found on server !!");
                    res.json({status:true,info:"Entries found on server",nomoreentry:true,newPlayers : queryResult});
                } else {
                    console.log("playerRegistration.listAllPendingToEnabledPlayers: length is equal to 20 ==> Entries found on server !!");
                    res.json({status:true,info:"Entries found on server",nomoreentry:true,newPlayers : queryResult});
                }
            }
        } else {
            console.log("playerRegistration.listAllPendingToEnabledPlayers ==> Error occurred on server while quering database : " + err);
            res.json({status:false,info:"error occurred while fetching entries from server !!"});
        }
    });

};

playerRegistration.togglePlayingStatusOfPlayer = function(req,res){
    console.log("Request received for togglePlayingStatusOfPlayer  : "  + JSON.stringify(req.body));
    console.log(req.body.adminToken);
    console.log(req.body.playerToken);
    console.log(req.body.enablingStatus);
    if(req.body.adminToken != "" && req.body.playerToken != "" && (req.body.enablingStatus != "" || req.body.enablingStatus === false)){
        playerCollection.findOne({playerToken:req.body.playerToken}, function (err,queryResult) {
            if(!err){
                if(queryResult){
                    queryResult.isEnabled = req.body.enablingStatus;
                    queryResult.save(function(err,updatedResult){
                        if(!err && updatedResult){
                            console.log("playerRegistration.enablePlayer ==> Playing status is updated on server !!");
                            res.json({status:true,info:"Playing status is updated on server !!",updatedEntries:updatedResult});
                        } else {
                            console.log("playerRegistration.enablePlayer ==> Error occurred on server while updating playing status : " + err);
                            res.json({status:false,info:"Error occurred on server while updating playing status !!"});
                        }
                    });
                } else {
                    console.log("playerRegistration.enablePlayer ==> player entry not found on server !!");
                    res.json({status:true,info:"Player not found on server !!"});
                }
            } else {
                console.log("playerRegistration.enablePlayer ==> Error occurred on server while quering database : " + err);
                res.json({status:false,info:"Error occurred while fetching entries from server !!"});
            }
        });
    } else {
        console.log("playerRegistration.enablePlayer ==> Insufficient request to process further !!");
        res.json({status:false,info:"Insufficient request to process further !!"});
    }
};

playerRegistration.updatePlayersCoins = function(from,to,coinCount,factor){
    console.log("updateCoins + " + " from " + from + " to " + to + " amount " + coinCount + " factor " + factor);
        playerAccount.findOne({playerToken : to},function(err,result){
            if(!err){
                if(result){
                    var statement = "";
                    if(factor == "add"){
                        console.log("Adding amount !!");
                        console.log("Prevbal " + result.totalCoins +"   " +typeof result.totalCoins);
                        result.totalCoins = parseInt(result.totalCoins) + parseInt(coinCount);
                        statement = coinCount + " credited by " + from;
                        updateTransactionLog(to,statement);
                    }
                    if(factor == "subtract"){
                        console.log("subtract amount !!");
                        console.log("Prevbal " + result.totalCoins +"   " +typeof result.totalCoins);
                        result.totalCoins = parseInt(result.totalCoins) - parseInt(coinCount);
                        statement = coinCount + " debited by " + from;
                        updateTransactionLog(to,statement);
                    }
                    result.save(function(err,updatedEntry){
                        if(!err && updatedEntry){
                            // mechanism required for notifying user !!
                            console.log("updatePlayersCoins : coins successfully updated !!" + updatedEntry);

                            //res.json({status:true,info:"Coins successfully updated.",accountInfo:updatedEntry});
                        } else {
                            console.log("updatePlayersCoins : could not update coins !!" + err);
                            //res.json({status:false,info:"Could not update coins."});
                        }
                    });
                } else {
                    console.log("playerRegistration.updateCoins ==> player entry not found on server !!");
                    //res.json({status:true,info:"Player not found on server !!"});
                }
            } else {
                console.log("playerRegistration.updateCoins ==> Error occurred on server while quering database : " + err);
                //res.json({status:false,info:"Error occurred while fetching entries from server !!"});
            }
        });
};

playerRegistration.updateAgentsCoins = function(from,to,coinCount,factor){
    console.log("updateAgentsCoins. updateCoins + " + " from " + from + " to " + to + " amount " + coinCount + " factor " + factor);
    adminProfiles.findOne({adminRefId : to},function(err,result){
        if(!err){
            if(result){
                var statement = "";
                if(factor == "add"){
                    console.log("Adding amount !!");
                    console.log("Prevbal " + result.adminWallet +"   " +typeof result.adminWallet);
                    result.adminWallet = parseInt(result.adminWallet) + parseInt(coinCount);
                    //statement = coinCount + " credited by " + from;
                    //updateTransactionLog(to,statement);
                }
                if(factor == "subtract"){
                    console.log("subtract amount !!");
                    console.log("Prevbal " + result.adminWallet +"   " +typeof result.adminWallet);
                    result.adminWallet = parseInt(result.adminWallet) - parseInt(coinCount);
                    //statement = coinCount + " debited by " + from;
                    //updateTransactionLog(to,statement);
                }
                result.save(function(err,updatedEntry){
                    if(!err && updatedEntry){
                        // mechanism required for notifying user !!
                        console.log("updatePlayersCoins : coins successfully updated !!" + updatedEntry);
                        //res.json({status:true,info:"Coins successfully updated.",accountInfo:updatedEntry});
                    } else {
                        console.log("updatePlayersCoins : could not update coins !!" + err);
                        //res.json({status:false,info:"Could not update coins."});
                    }
                });
            } else {
                console.log("playerRegistration.updateAgentsCoins ==> player entry not found on server !!");
                //res.json({status:true,info:"Player not found on server !!"});
            }
        } else {
            console.log("playerRegistration.updateAgentsCoins ==> Error occurred on server while quering database : " + err);
            //res.json({status:false,info:"Error occurred while fetching entries from server !!"});
        }
    });
};

playerRegistration.resetPassword = function(req,res){
    console.log("resetPassword + " + JSON.stringify(res.body));
    if(req.body.playerToken != "" && req.body.newPassword != "" && req.body.adminToken != ""){
        playerCollection.findOne({playerToken:req.body.playerToken},function(err,result){
            result.playerPassword = req.body.newPassword;
            result.save(function (err,updatedResult) {
                if(!err){
                    if(!updatedResult){
                        console.log("resetPassword : Could not find player detail on server !!");
                        res.json({status:true,info:"Could not find player detail on server"});
                    } else {
                        console.log("resetPassword : Password updated on server !!");
                        res.json({status:true,info:"Password updated on server",newPassword:updatedResult.playerPassword});
                    }
                } else {
                    console.log("resetPassword : Error occurred on server while updating password !!");
                    res.json({status:false,info:"Error occurred on server while updating password !!"});
                }
            });
        });
    }
};

playerRegistration.getAdminAccountDetail = function(req,res){
    console.log("getSAdminAccountDetail " + JSON.stringify(req.body));
    if(req.body.adminToken != ""){
        adminProfiles.findOne({},function(err,result){
            res.json({status:true, accountBal : result.adminWallet, info:"Top Manager Account Balance"});
        });
    } else {
        console.log("Error occured on server !! " + err);
        res.json({status:false,info:"Error occured on server !!"});
    }
};

playerRegistration.getPlayerAccountDetail = function(req,res){
    playerAccount.findOne({playerToken: req.body.playerToken},function(err,result){
        if(!err && result ){
            res.json({status:true,accBal : result.totalCoins});
        } else {
            res.json({status:false,info:"Could not find player on server !!"});
        }
    });
}

module.exports = playerRegistration;
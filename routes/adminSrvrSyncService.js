/**
 * Created by prateek on 2/1/16.
 */

// Sync service from Node server to admin portal

//Sync service from admin portal to Node js
// Node server will maintain detail of all the agents and top management employees.
var shortId = require("shortid");
var http = require('http');
var queryString = require('querystring');
var mongoose = require("mongoose");
var async = require("async");
var jwt = require("jsonwebtoken");
var adminProfiles = mongoose.model("adminProfiles");
var fundTransfers = mongoose.model("fundTransfers");
var playerCollection = mongoose.model("playerInfo");
var withdrawalTrans = mongoose.model("withdrawal");
var testDB          = mongoose.model("testColl");

var jwtKey = require("../config/keys");
var playerManagment = require("./playerRestration");
var analytics = require("./analytics");
var adminServerSyncServices = {};
var menu = require("../util/menuOpt");

shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

function sendHttpRequestToDifferentServer (endpoint){

    var options = {
        host: 'requestb.in',
        port: 80,
        path: endpoint,
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',//'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var httpreq = http.request(options, function (response) {
        console.log("Request send to url " + options.host+options.path);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
        response.on('end', function() {
            console.log("REQUEST SEND !!");
        });
    });
    httpreq.write(data);
    httpreq.end();
}

adminServerSyncServices.verifyLogin = function(req,res){
    console.log("REQUEST received for adminServerSyncServices.verifyLogin " + JSON.stringify(req.body));
    if(req.body.username != "" && req.body.pwd != ""){
        adminProfiles.findOne({adminRefId:req.body.username},function(err,result){
            console.log("Query result : " + result);
            if(!err && result){
                if(result.password == req.body.pwd){
                    var tokenPayload = {
                        pshId : result.adminRefId,
                        role :  result.role
                    };
                    console.log("About to sign " + JSON.stringify(tokenPayload) +" from key " + jwtKey.tokenKey);
                    var signed = jwt.sign(tokenPayload,jwtKey.tokenKey);

                    console.log(" JKSJKS " + signed);

                    res.json({
                        status: true,
                        authToken: signed,
                        name: result.name,
                        role: result.role == 100 ? "Admin" : "Agent",
                        roleId: result.role,
                        userId: result.adminRefId,
                        options : result.role == 100 ? menu.admin : menu.agent
                    });

                } else {
                    res.json({status:false,info:"Incorrect Password !!"});
                }
            } else {
                res.json({status:false,info:"Could not find username on server "});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }

};

adminServerSyncServices.transferFund = function(req,res){  // balance check of
    console.log("REQUEST received for adminServerSyncServices.transferFund " + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.to != "" && req.body.amt != ""){
        async.waterfall([
            function(wCB){
                //verify token
                jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
                    if(!err && decoded){
                        adminProfiles.findOne({role:100},function(err,qResult){
                            if(qResult.adminRefId == decoded.pshId){
                                console.log("Everything matched !!");
                                wCB(null,{status:true,auth:true,admin:decoded.pshId});
                            } else {
                                console.log("Could verify admin !!");
                                wCB({status:false,info:"Could verify admin !!"});
                            }
                        })
                    } else {
                        console.log("Unable to decode " + err);
                        wCB({status:false,info:"Unable to decode auth token !!"});
                    }
                });
            },
            function(prev,wCB){
                adminProfiles.findOne({adminRefId:prev.admin},function(err,qResult){
                    if(!err && qResult){
                        console.log("Agent Verified !!");
                        if(qResult.adminWallet >= req.body.amt){
                            qResult.adminWallet = Number(qResult.adminWallet) - Number(req.body.amt);
                            qResult.save(function(err,updatedWallet){
                                if(!err && updatedWallet){
                                    wCB(null,{status:true,result:qResult,admin:updatedWallet.adminRefId});
                                } else {
                                    wCB({status:false,info:"Unable to update wallet !!"});
                                }
                            });
                        } else {
                            wCB({status:false,info:"Insufficient balance to do fund transfer !!"});
                        }
                    } else {
                        console.log("Could verify Agent !!");
                        wCB({status:false,info:"Could verify Agent !!"});
                    }
                });
            },
            function(prev,wCB){
                //verify agent
                adminProfiles.findOne({adminRefId:req.body.to},function(err,qResult){
                    if(!err && qResult){
                        console.log("Agent Verified !!");
                        qResult.adminWallet = Number(qResult.adminWallet) + Number(req.body.amt);
                        qResult.save(function(err,updatedWallet){
                           if(!err && updatedWallet){
                               wCB(null,{status:true,result:qResult,admin:prev.admin});
                           } else {
                                wCB({status:false,info:"Unable to update wallet !!"});
                           }
                        });
                    } else {
                        console.log("Could verify Agent !!");
                        wCB({status:false,info:"Could verify Agent !!"});
                    }
                });
            },
            function(prev,wCB){
                //create fund transfer
                async.parallel([
                    function(parCB){
                        var nwFndTrf = new fundTransfers();
                        nwFndTrf.fundAmount = req.body.amt;
                        nwFndTrf.fundInitiator = prev.admin;
                        nwFndTrf.fundReceiver = req.body.to;
                        nwFndTrf.fundStatus = "COMPLETED";
                        nwFndTrf.fundRemark = req.body.amt + " credited.";
                        nwFndTrf.fundTransferType = "Credit";
                        nwFndTrf.fundTransferId = shortId.generate();
                        nwFndTrf.fundType = "FNDTRF";
                        nwFndTrf.ledgerOf = req.body.to;
                        nwFndTrf.save(function(err,saved){
                            if(!err && saved){
                                parCB(null,{status:true,info:"Fund Transfer Successful !!"});
                            } else {
                                parCB({status:false,info:"Fund Transfer Un-successful !!"});
                            }
                        });
                    },
                    function(parCB){
                        var nwFndTrf = new fundTransfers();
                        nwFndTrf.fundAmount = req.body.amt;
                        nwFndTrf.fundInitiator = req.body.to;
                        nwFndTrf.fundReceiver = prev.admin;
                        nwFndTrf.fundStatus = "COMPLETED";
                        nwFndTrf.fundRemark = req.body.amt + " debit.";
                        nwFndTrf.fundTransferType = "Debit";
                        nwFndTrf.fundTransferId = shortId.generate();
                        nwFndTrf.fundType = "FNDTRF";
                        nwFndTrf.ledgerOf = prev.admin;
                        nwFndTrf.save(function(err,saved){
                            if(!err && saved){
                                parCB(null,{status:true,info:"Fund Transfer Successful !!"});
                            } else {
                                parCB({status:false,info:"Fund Transfer Un-successful !!"});
                            }
                        });
                    }
                ],function(err,results){
                    if(!err){
                        wCB(null,{status:true,info:"Fund Transfer Successful !!"});
                    } else{
                        wCB({status:false,info:"Fund Transfer Un-successful !!"});
                    }
                });
            }
        ],function(err,wfCBResult){
            if(!err){
                res.json(wfCBResult);
            } else{
                res.json(err);
            }
        });
    } else {
        console.log("Error occurred on server which processing request !!");
        res.json({status: false, info: "Error occurred on server which processing request !!"});
    }
};

adminServerSyncServices.generateAuthToken = function(req,res){
    console.log("Request received for cgenerateAuthToken : " + JSON.stringify(req.body));
    if(req.body.memberCode != ""){
        console.log("Into if Condition !!");
        adminProfiles.findOne({adminRefId:req.body.memberCode},function(err,qResult){
            console.log("Query result Err!!" + err + " Result " + qResult);
            if(!err){
                console.log("No error !!")
                if(qResult){
                    console.log("Result is available !!");
                    var tokenPayload = {
                        pshId : qResult.adminRefId,
                        role :  qResult.role
                    };
                    console.log("About to sign " + JSON.stringify(tokenPayload) +" from key " + jwtKey.tokenKey);
                    var signed = jwt.sign(tokenPayload,jwtKey.tokenKey);
                    console.log(" JKSJKS " + signed);
                    res.json({status:true,authToken:signed});

                } else {
                    console.log("Now member available against shared id");
                    res.json({status: false, info: "Now member available against shared id !!"});
                }
            } else {
                console.log("Error occurred on server which processing request !!");
                res.json({status: false, info: "Error occurred on server which processing request !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.newMember = function(req,res){
    console.log("Request received for creating new member !! newMember : " + JSON.stringify(req.body));
    if(req.body.memberType != "" && req.body.memberCode != "" && req.body.memberName != "" && req.body.memberCity != "" &&
        req.body.memberState != "" && req.body.memberAddress != "" && req.body.memberMobile != "" && req.body.authToken){
        async.waterfall([
            function(wCB){
                console.log("Water fall 1");
                jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
                    if(!err && decoded){
                        console.log("Decoded !! : " + JSON.stringify(decoded));
                        wCB(null,decoded);
                    } else {
                        console.log("Could not decode auth token due to : " + err);
                        wCB({status:false,info:"Unable to decoded token !!"});
                    }
                });
            },
            function(prevResult,wCB){
                console.log("Water fall 2");
                var nwMember = new adminProfiles();
                if(req.body.memberType.toLowerCase() == "statehead"){
                    nwMember.role = 101;
                }
                if(req.body.memberType.toLowerCase() == "districthead"){
                    nwMember.role = 102;
                }
                if(req.body.memberType.toLowerCase() == "agent"){
                    nwMember.role = 103;
                }
                nwMember.name = req.body.memberName;
                nwMember.state = req.body.memberState;
                nwMember.district = req.body.memberCity;
                nwMember.pincode = req.body.memberPinCode;
                nwMember.area = req.body.memberAddress;
                nwMember.adminWallet = 0; // wallet amount will be 0 at the time of creation
                nwMember.adminRefId = req.body.memberCode;
                nwMember.commission = req.body.memberComm;
                nwMember.mobileNumber = req.body.memberMobile;
                nwMember.createdBy = prevResult.pshId;
                nwMember.save(function(err,saved){
                    if(!err && saved){
                        console.log("New member saved !! " + saved);
                        wCB(null,{status : true,info:"New member saved successfully on GameServer"});
                    } else {
                        console.log("Could not save new member !! " + err);
                        wCB({status : false,info:"Error occurred on GameServer"});
                    }
                });
            }
        ],function(err,result){
            if(!err){
                res.json(result);
            } else {
                console.log("Error is " + err);
                res.json(err);
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status:false,info:"insufficient information to process request !!"});
    }
};

adminServerSyncServices.updateMemberInfo = function(req,res){
    console.log("Request received for updateMemberInfo : " + JSON.stringify(req.body));
    if(req.body.memberCode != "" && req.body.authToken != "" && req.body.updatedTo != ""){
        async.waterfall([
            function(wCB){
                jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
                    console.log("Decoded token : " + JSON.stringify(decoded));
                    if(decoded.pshId == req.body.memberCode){
                        console.log("Token verified !!");
                        wCB(null,{status:true,info:"Token verified !!"});
                    } else {
                        wCB({status:false,info:"Failed to authenticate user !!"});
                    }
                });
            },
            function(prevResult,wCB){
                console.log("Updated to : " + JSON.stringify(req.body.updateTo));
                adminProfiles.findOne({adminRefId:req.body.updateTo.updtMemberCode},function(err,result){
                    if(!err && result){
                        result.name = req.body.updateTo.updtName ? req.body.updateTo.updtName : result.name;
                        result.area = req.body.updateTo.updtAddress ? req.body.updateTo.updtAddress : result.area;
                        result.district = req.body.updateTo.updtCity ? req.body.updateTo.updtCity : result.district;
                        result.pincode = req.body.updateTo.updtPinCode ? req.body.updateTo.updtPinCode : result.pincode;
                        result.state = req.body.updateTo.updtState ? req.body.updateTo.updtState : result.state;
                        result.mobileNumber = req.body.updateTo.updtMobile ? req.body.updateTo.updtMobile : result.mobileNumber;
                        result.commission = req.body.updateTo.updtComm ? req.body.updateTo.updtComm : result.commission;
                        result.save(function(err,updated){
                            if(!err && updated){
                                console.log("Update member info " + updated);
                                wCB(null,{status:true,info:"Member info updated on GameServer !!"});
                            } else {
                                console.log("Unable to update member info !!");
                                wCB({status:false,info:"Unable to update member info !!"});
                            }
                        });
                    } else {
                        console.log("Could not find member detail on server !!");
                        wCB({status:false,info:"Could not find member detail on server !!"});
                    }
                });
            }
        ],function(err,result){
            if(!err){
                res.json(result);
            } else {
                res.json(err);
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.updateWallet = function (req, res) { // will only be used for transaction in which agent is involved
    console.log("Request received for creating new member !! updateAccount : " + JSON.stringify(req.body));
    if (req.body.memberAmount != "" && req.body.memberTransferType != "" && req.body.fundInitiator != "" &&
        req.body.fundReceiver != "" && req.body.authToken) { // memberTransferType will be credit/debit
        async.waterfall([
            function(wCB){
                jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
                    if(!err && decoded){
                        console.log("Auth token decoded " + JSON.stringify(decoded));
                        if(decoded.pshId == req.body.fundInitiator){
                            console.log("Authenticated fund initiator token !!");
                            wCB(null,{status:true});
                        } else {
                            console.log("Could not authenticate initiator token !!");
                            wCB({status:false,info:"Could not authenticate initiator token !!"});
                        }
                    } else {
                        wCB({status:false,info:"Could not decode token !!"});
                    }
                });
            },
            function(prevResult,wCB){
                console.log("Into parallel !!")
                async.parallel([
                    function(pCB){
                        adminProfiles.findOne({adminRefId:req.body.fundReceiver},function(err,result){
                            if(!err){
                                console.log("Parallel 1 : " + result);
                                if(result){
                                    pCB(null,{status:true,isAgent:true});
                                } else {
                                    pCB(null,{status:false,info:"Agent does not exists"});
                                }
                            } else {
                                pCB({status:false,info:"Error occurred on server !!"});
                            }
                        });
                    },
                    function(pCB){
                        playerCollection.findOne({playerToken:req.body.fundReceiver},function(err,result){
                            if(!err){
                                if(result){
                                    console.log("Parallel 2 : " + result);
                                    pCB(null,{status:true,isPlayer:true});
                                } else{
                                    pCB(null,{status:false,info:"Player does not exists"});
                                }
                            } else {
                                pCB({status:false,info:"Error occurred on server !!"});
                            }
                        });
                    },
                    function(pCB){
                        adminProfiles.findOne({adminRefId:req.body.fundInitiator},function(err,result){
                            if(!err){
                                if(result){
                                    console.log("Parallel 3 : " + result);
                                    if(result.adminWallet >= req.body.memberAmount){
                                        result.adminWallet = parseInt(result.adminWallet) - parseInt(req.body.memberAmount);
                                        result.save(function(err,updatedWallet){
                                            if(!err && updatedWallet){
                                                pCB(null,{status:true});
                                            } else {
                                                console.log("Error occurred on server !!" + err);
                                                pCB({status:false,info:"Error occurred on server !!"});
                                            }
                                        });
                                    } else {
                                        pCB({status:false,info:"Insufficient balance to transfer !!"})
                                    }
                                } else {
                                    pCB({status:false,info:"Agent does not exists"});
                                }
                            } else {
                                pCB({status:false,info:"Error occurred on server !!"});
                            }
                        });
                    }
                ],function(err,results){
                    console.log("Parallel final : " + JSON.stringify(results));
                    if(!err){
                        //wCB(null,results);
                        var factor = req.body.memberTransferType.toLowerCase() == "credit" ? "add" : "subtract";
                        if(results[1].isPlayer){
                            console.log("Its is player");
                            playerManagment.updatePlayersCoins(req.body.fundInitiator,req.body.fundReceiver,req.body.memberAmount,factor);
                        }
                        if(results[0].isAgent){
                            console.log("Its is agent");
                            playerManagment.updateAgentsCoins(req.body.fundInitiator,req.body.fundReceiver,req.body.memberAmount,factor);
                        }
                        createLedgerEntries(req.body.memberAmount,req.body.fundInitiator,req.body.fundReceiver,req.body.memberTransferType,req.body.fundTrfType);
                        wCB(null,{status:true,info:"Transaction updated on GameServer !!"});
                    } else {
                        console.log("ERROR : " + err);
                        wCB({status:false,info:err.info});
                    }
                });
            }
        ],function(err,result){
            if(!err){
                res.json(result);
            } else {
                res.json(err);
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.getPlayerAccount = function(req,res){
    console.log("Received request for getEnabledPlayers" + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.memberCode != "" && req.body.playerToken != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    playerManagment.getPlayerAccountDetail(req,res);
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.getEnabledPlayers = function(req,res){
    console.log("Received request for getEnabledPlayers" + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.memberCode != "" && req.body.lowerLimit != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    playerManagment.listAllEnabledPlayers(req,res);
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.getNewPlayers = function(req,res){
    console.log("Request received for adminServerSyncServices.getNewPlayers" + JSON.stringify(req.body));
    console.log("adminServerSyncServices.getNewPlayers value of authToken" + JSON.stringify(req.body.authToken));
    if(req.body.authToken != "" && req.body.memberCode != "" && req.body.lowerLimit != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    playerManagment.listAllPendingToEnabledPlayers(req,res);
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.togglePlayerStatus = function(req,res){
    console.log("Request for adminServerSyncServices.togglePlayerStatus : " + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.memberCode != "" &&
        req.body.playerToken != "" && (req.body.enablingStatus != "" || req.body.enablingStatus === false)){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    playerManagment.togglePlayingStatusOfPlayer(req,res);
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.getCompanyAccountInfo = function(req,res){
    if(req.body.authToken != "" && req.body.memberCode != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value getCompanyAccountInfo : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched getCompanyAccountInfo !!");
                    //playerManagment.togglePlayingStatusOfPlayer(req,res);
                    adminProfiles.findOne({adminRefId : req.body.memberCode},function(err,result){
                        if(!err && result){
                            console.log("adminServerSyncServices.getCompanyAccountInfo " + result);
                            res.json({status:true,accountBal:result.adminWallet});
                        } else {
                            res.json({status:false,accountBal:result.adminWallet,info:"Could not find Admin Account"});
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched getCompanyAccountInfo !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token getCompanyAccountInfo !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.passwordChange = function(req,res){
    if(req.body.authToken != "" && req.body.memberCode != "" && req.body.newPassword != "" && req.body.playerToken != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    playerManagment.resetPassword(req,res);
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.createAgent = function(req,res){
    console.log("Request received for adminServerSyncServices.createAgent " + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.agentName !="" && req.body.agentMob !="" && req.body.agentPwd != "" && req.body.agentComm != ""){
        async.waterfall([function(wCB){
            jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
                if(!err && decoded){
                    console.log("Decoded value : " + JSON.stringify(decoded));
                    if(decoded.pshId == "GSSU001" && decoded.role == 100){
                        wCB(null,{status:true,admin:decoded.pshId});
                    } else {
                        console.log("Decoded Value did not matched !!");
                        wCB({status:false,info:"Failed to authenticate user !!"});
                    }
                } else {
                    console.log("Unable to decode auth token !!" + err);
                    wCB({status:false,info:"Unable to decode auth token !!"});
                }
            });
        },
        function(prev,wCB){
            adminProfiles.count({},function(err,result){
                if(!err){
                    if(result > -1){
                        var nwAgent = new adminProfiles();
                        nwAgent.adminRefId = "AG" + (Number(result) + Number(1001));
                        nwAgent.role = 103;
                        nwAgent.name = req.body.agentName;
                        nwAgent.mobileNumber = req.body.agentMob;
                        nwAgent.password = req.body.agentPwd;
                        nwAgent.commission = req.body.agentComm;
                        nwAgent.state = req.body.agentState;
                        nwAgent.district = req.body.agentDist;
                        nwAgent.pincode = req.body.agentPin;
                        nwAgent.area = req.body.agentAdrs;
                        nwAgent.adminWallet = 0; // wallet amount will be 0 at the time of creation
                        nwAgent.createdBy = prev.admin;
                        nwAgent.save(function(err,saved){
                            if(!err && saved){

                                console.log("New member saved !! " + saved);
                                wCB(null,{status : true,info:"New member saved successfully on GameServer",adminId : saved.adminRefId});
                            } else {
                                console.log("Could not save new member !! " + err);
                                wCB({status : false,info:"Error occurred on GameServer"});
                            }
                        });
                    } else {
                        wCB({status:false,info:"Something went wrong on server !!"});
                    }
                } else {
                    wCB({status:false,info:"Something went wrong on server !!"});
                }
            });
        }],function(err,result){
            if(!err && result){
                res.json(result);
            } else {
                res.json(err);
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.getTransactionRecords = function(req,res){
    console.log("Received request adminServerSyncServices.getTransactionRecords " + JSON.stringify(req.body));
    if(req.body.authToken != "" && req.body.memberCode != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.memberCode){
                    console.log("Decoded Value matched !!");
                    fundTransfers.find({ledgerOf:req.body.memberCode},function(err,results){
                        if(!err){
                            if(results.length > 0){
                                res.json({status:true,transactions:results});
                            } else {
                                res.json({status:false,info:"No transactions to show !!"});
                            }
                        } else{
                            res.json({status:false,info:"Error occurred on server"});
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.createWithdrawFund = function(req,res){
    console.log("************************************");
    console.log("adminServerSyncServices.createWithdrawFund " + JSON.stringify(req.body));
    console.log("************************************");
    if(req.body.authToken != "" && req.body.from != "" && req.body.amount != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.from){
                    console.log("Decoded Value matched !!");
                    async.waterfall([
                        function(wCB){
                            withdrawalTrans.findOne({withdrawalInit:req.body.from,status:"PENDING"},function(err,result){
                                if(!err){
                                    if(result){
                                        console.log("Existing withdrawal request !! "+result);
                                        wCB({status:false,info:"You already have withdrawal request !!"});
                                    } else {
                                        console.log("No withdrawal request so far !!");
                                        wCB(null,{status:true,info:"No withdrawal request so far !!"});
                                    }
                                } else {
                                    console.log("Error occurred on server !! " + err);
                                    wCB({status:false,info:"Error occurred on server !!"});
                                }
                            });
                        },
                        function(prev,wCB){
                            //fetch agent bal and check bal respond accordingly
                            adminProfiles.findOne({adminRefId:req.body.from},function(err,result){
                                if(!err && result){
                                    if(result.adminWallet > req.body.amount){
                                        result.adminWallet = parseInt(result.adminWallet) - parseInt(req.body.amount);
                                        result.save(function(err,updated){
                                            if(!err && updated){
                                                wCB(null,{status:true,adminObj:result});
                                            } else {
                                                console.log("Error occurred on server while updating admin wallet from withdrawal !!" + err);
                                                wCB({status:false,info:"Error occurred on server !!"});
                                            }
                                        });
                                    } else {
                                        wCB({status:false,info:"Insufficient balance for withdrawal !!"});
                                    }
                                } else {
                                    console.log("Error occurred on server !! " + err);
                                    wCB({status:false,info:"Error occurred on server !!"});
                                }
                            });
                        },
                        function(prev,wCB){
                            //create withdrawal request
                            if(prev.status){
                                var nwWith = new withdrawalTrans();
                                nwWith.withdrawalId = shortId.generate();
                                nwWith.withdrawalAmt = req.body.amount;
                                nwWith.withdrawalInit = req.body.from;
                                nwWith.withdrawalResp = prev.adminObj.createdBy;
                                nwWith.status = "PENDING";
                                nwWith.save(function(err,saved){
                                    if(!err && saved){
                                        createWithdrawalTransaction(req.body.amount,req.body.from);
                                        wCB(null,{status:true,entry:saved,info:"Withdrawal request send !!"});
                                    } else {
                                        console.log("Error occurred on server while creating withdrawal" + err);
                                        wCB({status:false,info:"Error occurred on server while creating withdrawal"});
                                    }
                                });
                            } else {
                                wCB(null,{}); // this block will never execute
                            }
                        }
                    ],function(err,result){
                        if(!err){
                            res.json(result);
                        } else {
                            res.json(err);
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    } else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.withdrawFundHist = function(req,res){
    if(req.body.authToken != "" && req.body.for != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.for){
                    console.log("Decoded Value matched !!");
                    withdrawalTrans.find({withdrawalInit:req.body.for},function(err,results){
                        if(!err && results){
                            res.json({status:true,entries:results});
                        } else {
                            res.json({status:false,info:"Could not find your entries !!"});
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    }else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.pendingWithdrawal = function(req,res){
    if(req.body.authToken != "" && req.body.for != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.for){
                    console.log("Decoded Value matched !!");
                    withdrawalTrans.find({withdrawalResp:req.body.for,status:"PENDING"},function(err,results){
                        if(!err && results){
                            if(results.length > 0){
                                res.json({status:true,entries:results});
                            } else {
                                res.json({status: false, info: "No pending withdrawal request !!"});
                            }
                        } else {
                            res.json({status:false, info: "Could not find your entries !!"});
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    }else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.toggleWithdrawal = function(req,res){
    if(req.body.authToken != "" && req.body.by != ""&& req.body.withdrawalId != "" && req.body.status != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.by){
                    console.log("Decoded Value matched !!");
                    async.waterfall([
                        function(wCB){
                            withdrawalTrans.update({
                                    withdrawalId : req.body.withdrawalId,
                                    withdrawalResp : req.body.by
                                },
                                {
                                    $set:{status:req.body.status}
                                },
                                {
                                    upsert:false
                                },
                                function(err,result){
                                    if(!err){
                                        if(result){
                                            //db request to find withdrawal req !!
                                            wCB(null,{status:true,info:"Withdrawal updated !!"});
                                        } else {
                                            wCB({status:false,info:"Could not find requested withdrawal !!"});
                                        }
                                    } else{
                                        wCB({status:false,info:"Error while updating withdrawal !!"});
                                    }
                                }
                            );
                        },
                        function(prev,wCB){
                            withdrawalTrans.findOne({withdrawalId : req.body.withdrawalId},function(err,result){
                                if(!err && result){
                                    fundTransfers.update(
                                        {
                                            fundInitiator:result.withdrawalInit,
                                            fundStatus:"PENDING",
                                            fundType :"WIDRWL"
                                        },
                                        {
                                            $set:{fundStatus:"COMPLETED"}
                                        },
                                        {
                                            upsert:true
                                        },
                                        function(err,result){
                                            if(!err){
                                                if(result){
                                                    wCB(null,{status:true,info:"Transaction updated!!"});
                                                }else{
                                                    wCB({status:false,info:"Could not find withdrawal transaction!!"});
                                                }
                                            } else {
                                                wCB({status:false,info:"Error while updating transaction !!"});
                                            }
                                        });
                                } else{
                                    wCB({status:false,info:"Error while finding transaction !!"});
                                }
                            });
                        }
                    ],function(err,result){
                        if(!err){
                            res.json(result);
                        } else{
                            res.json(err);
                        }
                    });
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    }else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

adminServerSyncServices.listAgents = function(req,res){
    adminProfiles.find({role:103},"adminRefId name commission",function(err,results){
        if(!err && results){
            if(results.length > 0){
                res.json({status:true,agents:results});
            } else {
                res.json({status:false,info:"No agents on server !!"});
            }
        } else {
            console.log("Error on server !!" + err);
            res.json({status:false,info:"Error on server !!"});
        }
    });
};

adminServerSyncServices.getDrop = function(req,res){
    if(req.body.authToken != "" && req.body.by != "" && req.body.between.startDate != "" && req.body.between.endDate != ""){
        jwt.verify(req.body.authToken,jwtKey.tokenKey,function(err,decoded){
            if(!err && decoded){
                console.log("Decoded value : " + JSON.stringify(decoded));
                if(decoded.pshId == req.body.by){
                    console.log("Decoded Value matched !!");
                    if(req.body.role == 100){
                        analytics.getDropBetweenRangeOfAdmin(req,res);
                    }
                } else {
                    console.log("Decoded Value did not matched !!");
                    res.json({status:false,info:"Failed to authenticate user !!"});
                }
            } else {
                console.log("Unable to decode auth token !!" + err);
                res.json({status:false,info:"Unable to decode auth token !!"});
            }
        });
    }else {
        console.log("insufficient information to process request !!");
        res.json({status: false, info: "insufficient information to process request !!"});
    }
};

function createLedgerEntries(amt,from,to,trfTyp,fndTyp){
    console.log("createLedgerEntries called");
    async.parallel([
        function(parCB){
            var nwFndTrfTo = new fundTransfers();
            nwFndTrfTo.fundAmount = amt;
            nwFndTrfTo.fundInitiator = from;
            nwFndTrfTo.fundReceiver = to;
            nwFndTrfTo.fundStatus = "COMPLETED";
            nwFndTrfTo.fundRemark = amt + " credited.";
            nwFndTrfTo.fundTransferType = (trfTyp == "Credit") ? "Credit" : "Debit";
            nwFndTrfTo.fundTransferId = shortId.generate();
            nwFndTrfTo.fundType = fndTyp;
            nwFndTrfTo.ledgerOf = to;
            nwFndTrfTo.save(function(err,saved){
                if(!err && saved){
                    parCB(null,{status:true,info:"Fund Transfer Successful !!"});
                } else {
                    parCB({status:false,info:"Fund Transfer Un-successful !!"});
                }
            });
        },
        function(parCB){
            var nwFndTrfTo = new fundTransfers();
            nwFndTrfTo.fundAmount = amt;
            nwFndTrfTo.fundInitiator = to;
            nwFndTrfTo.fundReceiver = from;
            nwFndTrfTo.fundStatus = "COMPLETED";
            nwFndTrfTo.fundRemark = amt + " debited.";
            nwFndTrfTo.fundTransferType = (trfTyp == "Credit") ? "Debit" : "Credit";
            nwFndTrfTo.fundTransferId = shortId.generate();
            nwFndTrfTo.fundType = fndTyp;
            nwFndTrfTo.ledgerOf = from;
            nwFndTrfTo.save(function(err,saved){
                if(!err && saved){
                    parCB(null,{status:true,info:"Fund Transfer Successful !!"});
                } else {
                    parCB({status:false,info:"Fund Transfer Un-successful !!"});
                }
            });
        }
    ],function(err,results){
        if(!err){
            console.log(results);
        } else{
            console.log(err);
        }
    });
}

function createWithdrawalTransaction(amount,initiator){
    // only for creating withdrawal leg
    var nwFndTrfTo = new fundTransfers();
    nwFndTrfTo.fundAmount = amount;
    nwFndTrfTo.fundInitiator = initiator;
    nwFndTrfTo.fundReceiver = initiator;
    nwFndTrfTo.fundStatus = "PENDING";
    nwFndTrfTo.fundRemark = amount + " Withdrawal request WIDRWL!!";
    nwFndTrfTo.fundTransferType = "WIDRWL";
    nwFndTrfTo.fundTransferId = shortId.generate();
    nwFndTrfTo.fundType = "WIDRWL";
    nwFndTrfTo.ledgerOf = initiator;
    nwFndTrfTo.save(function(err,saved){
        if(!err && saved){
            console.log("Withdrawal leg created !!");
        } else {
            console.log("Error in creating withdrawal leg !!" + err);
        }
    });
};



module.exports = adminServerSyncServices;
/**
 * Created by prateek on 17/1/16.
 */
var mongoose = require("mongoose");
var adminProfiles = mongoose.model("adminProfiles");
var fundTransfers = mongoose.model("fundTransfers");
var playerCollection = mongoose.model("playerInfo");
var playerTransactionLogs = mongoose.model("playerAccountTransactionLogs");
var playerAccount = mongoose.model("playerAccount");


var analytics = {};

// analytics.getDropBetweenRangeOfAdmin = function(req,res){
//     console.log("Request for getDropBetweenRange : " + JSON.stringify(req.body));
//     fundTransfers.aggregate([
//         {
//             $match : {
//                 fundReceiver: req.body.by,
//                 fundType    : {$in : ["RAKE","TIP"]},
//                 createdOn   : {$gt:req.body.between.startDate , $lt:req.body.between.endDate}
//                 }
//         },
//         {
//             $group : {
//                 _id:"$fundReceiver",
//                 money : {$sum:"$fundAmount"}
//             }
//         }
//     ],function(err,results){
//         if(!err){
//             res.json({status:true,result:results});
//         } else {
//             console.log("Error in finding drop !!" + err);
//             res.json({status:false,info:"Error in finding drop !!"});
//         }
//     });
// };

// Analy Req: 1 & 6
// Get Drop made by particular Top management(Admin), Top State, Top District, Agents
// How much money agent made on daily,weekly,monthly basis.
analytics.getDropBetweenRangeOfAdmin = function(req,res){
    console.log("Request for getDropBetweenRange : " + JSON.stringify(req.body));
    fundTransfers.aggregate([
        {
            $match : {
                fundReceiver: req.body.adminId,
                fundType    : {$in : ["RAKE","TIP"]},
                createdOn: { $gte: parseInt(req.body.startDate), $lt: parseInt(req.body.endDate)  } 
                }
        },
        {
            $group : {
                _id:"$fundReceiver",
                money : {$sum:"$fundAmount"}
            }
        },
        {
             $project: {
                _id: 0,                
                fundReceiver: "$_id",
                money: "$money"
             }
        }
    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

//Analy Req: 2
// Get Drop made by admin from particular agent
analytics.getDropBetweenRangeOfAdminFromAgent = function(req,res){
    console.log("Request for getDropBetweenRangeOfAdminFromAgent : " + JSON.stringify(req.body));
    fundTransfers.aggregate([
        {
            $match : {
                fundReceiver: req.body.adminId,
                fundInitiator: req.body.agentId,
                fundType: {$in : ["RAKE","TIP"]},
                createdOn: { $gte: parseInt(req.body.startDate), $lt: parseInt(req.body.endDate)  } 
            }
        },
        {
            $group : {
                _id: { fundReceiver: "$fundReceiver", fundInitiator: "$fundInitiator" },
                money : {$sum:"$fundAmount"}
            }
        },
        {
             $project: {
                _id: 0,                
                fundReceiver: "$_id.fundReceiver",
                fundInitiator: "$_id.fundInitiator",
                money: "$money"
             }
        }
    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

//Analy Req: 3
// Top 20 player which  giving maximum drop with agent name.

analytics.getTop20PlayerDropWithAgent = function(req,res){
    console.log("Request for getTop20PlayerDropWithAgent : " + JSON.stringify(req.body));
    playerTransactionLogs.aggregate([
        
        {
            $group :{ _id: {
                transRcvr: "$transRcvr",
                transInit: "$transInit"
            },
            money: { $sum: "$transAmount" }}
        },
        { $sort : { money : -1 } },
        { $limit : 20 },
        {
             $project: {
                _id: 0,                
                transRcvr: "$_id.transRcvr",
                transInit: "$_id.transInit",
                money: "$money"
             }
        }

    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

// Analy Req: 4 & 7
// Top 10 player of that agent which giving max drop.
// Top 10 player of that agent which giving maximum revenue.

analytics.getTop10PlayerDropForParticularAgent = function(req,res){
    console.log("Request for getTop10PlayerDropWithAgent : " + JSON.stringify(req.body));
    playerTransactionLogs.aggregate([
        { $match: {
                transRcvr: req.body.agentId,
                transType: {$in : ["RAKE","TIP"]}
            } 
        },
        
        {
            $group :{ _id: {
                transRcvr: "$transRcvr",
                transInit: "$transInit"
            },
            money: { $sum: "$transAmount" }}
        },
        { $sort : { money : -1 } },
        { $limit : 20 },
        {
             $project: {
                _id: 0,                
                transRcvr: "$_id.transRcvr",
                transInit: "$_id.transInit",
                money: "$money"
             }
        }

    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

//Analy Req: 5
// How much money admin making using tip.

analytics.getGetTipAmountByAdmin = function(req,res){
    console.log("Request for getGetTipAmountByAdmin : " + JSON.stringify(req.body));
    fundTransfers.aggregate([
        {
            $match : {
                fundReceiver: "ad1",
                fundType    : "TIP"
            }
        },
        {
            $group : {
                _id:"$fundReceiver",
                tipEarned : {$sum:"$fundAmount"}
            }
        },
        {
             $project: {
                _id: 0,                
                fundReceiver: "$_id",
                tipEarned: "$tipEarned"
             }
        }
    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

// Analy Req: 8
// Agent can see all the transaction via putting player id in dashboard.

analytics.getAllTransactionForAgent = function(req,res){
    console.log("Request for getAllTransactionForAgent : " + JSON.stringify(req.body));
    playerTransactionLogs.aggregate([
        {
            $match: { $or: [{ transInit: req.body.playerId }, { transRcvr: req.body.playerId }] }
        }
    ],function(err,results){
        if(!err){
            res.json({status:true,result:results});
        } else {
            console.log("Error in finding drop !!" + err);
            res.json({status:false,info:"Error in finding drop !!"});
        }
    });
};

module.exports = analytics;


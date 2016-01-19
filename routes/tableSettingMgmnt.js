/**
 * Created by prateek on 15/11/15.
 */

var mongoose = require("mongoose");
var roomType = mongoose.model("roomType");

var roomManagement = {};

roomManagement.getAllRooms = function(req,res){
    if(req.body.authToken != ""){
        roomType.find({},function(err,result){
            if(!err){
                if(result.length > 0){
                    console.log("roomManagement.getAllRooms : Rooms are available on server !!");
                    res.json({status:true,info:"Query executed successfully but no rooms found on server !!",rooms:result});

                } else {
                    console.log("roomManagement.getAllRooms : Query executed successfully but no rooms found on server !!");
                    res.json({status:true,info:"Query executed successfully but no rooms found on server !!"});
                }
            } else {
                console.log("roomManagement.getAllRooms : Error occurred on server while finding existing room !! " + err);
                res.json({status:false,info:"Error occurred on server while finding existing room !!"});
            }
        });
    } else {
        res.json({status:false,info:"Insufficient parameter to process request !!"});
    }
};

roomManagement.updateRoomConfiguration = function(req,res){
    console.log("updateRoomConfiguration payload " + JSON.stringify(req.body));
    if(req.body.authToken && req.body.authToken != "" && req.body.roomId != ""){
        roomType.findOne({_id:req.body.roomId},function(err,result){
            if(!err){
                if(result){
                    console.log("roomManagement.getAllRooms : Queried rooms is available on server !!");
                    result.roomName     = req.body.roomName;
                    result.bootAmount   = req.body.bootAmount;
                    result.minAllowed   = req.body.minAllowed;
                    result.maxAllowed   = req.body.maxAllowed;
                    result.chaalLimit   =  req.body.chaalLimit;
                    result.potLimit     =  req.body.potLimit;
                    result.blindLimit   = req.body.blindLimit;
                    result.maxPlayer    = req.body.maxPlayer;
                    result.save(function(err,updatedResult){
                        if(!err&& updatedResult){
                            console.log("roomManagement.updateRoomConfiguration : Value successfully updated on server !!");
                            res.json({status:true,info:"Value successfully updated on server !!",updatedRoomConfig : updatedResult});
                        } else {
                            console.log("roomManagement.updateRoomConfiguration : Error occurred on server while updating room details !!" + err);;
                            res.json({status:false,info:"Error occurred on server while updating room details !!"});
                        }
                    });
                } else {
                    console.log("roomManagement.getAllRooms : Queried rooms is not available on server !!");
                    res.json({status:true,info:"Queried rooms is not available on server !!"});
                }
            } else {
                console.log("roomManagement.updateRoomConfiguration : Error occurred on server while finding queried room !!");
                res.json({status:false,info:"Error occurred on server while finding queried room !!"});
            }
        });
    } else {
        res.json({status:false,info:"Insufficient parameter to process request !!"});
    }
};

module.exports = roomManagement;

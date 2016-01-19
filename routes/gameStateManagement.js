/**
 * Created by Amrendra on 08/01/2015.
 */
var shortId = require("shortid");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var adminProfiles = mongoose.model("adminProfiles");
var gameState = mongoose.model("gameState");
var gameStateManagement = {}

gameStateManagement.getGameState = function(req,res){
    console.log("Request received for getGameState : " + JSON.stringify(req.body));
    if(req.body) {
        gameState.find({}, function (err, result) {
            console.log(result);
            if (!err) {
                 res.json({
                    status  : true,
                    state   : !!result && result.length > 0 && !!result.state ? result.state : "Running",
                });
            } else {
                console.log("Error occured on server !!" + err);
                res.json({status: false, info: "Error occurred on server !!"});
            }
        });
    }
};

module.exports = gameStateManagement;
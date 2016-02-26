'use strict';

var mongoose = require('mongoose'),
    bingoAdd = mongoose.model('bingoAdd');

var bingoAddController = {};

/**
   GET: /bingoAdd/:paidType

   :paidType -> unpaid OR paid
 */

bingoAddController.getByType = function (req,res,next) {
    if(req.params.paidType == 'paid' || req.params.paidType == 'unpaid'){
      bingoAdd.getPaidUnpaid(function(err, result) {
        if (!err) {
            var obj = {};
            if(!result){
                return res.json({status:false, result:null});
            }
            else{
                if(req.params.paidType == 'paid' ){
                    if(result.unpaid)
                        result.unpaid = undefined;
                    obj = result.paid;
                }
                if(req.params.paidType == 'unpaid' ){
                    if(result.paid)
                        result.paid = undefined;
                    obj = result.unpaid;
                }
                
                    return res.json({status:true, result: obj});
            }
        } else {
            return res.json({status:false, result:"Unable to get list"});
        }
      });
    }
    else
      return res.json({status:false, info:"Invalid request"});
};


/**
   POST: /bingoAdd/:paidType

   :paidType -> unpaid OR paid
 */

bingoAddController.create = function (req,res,next) {
  if(req.params.paidType == 'paid' || req.params.paidType == 'unpaid'){
    bingoAdd.getPaidUnpaid(function(err, result) {
      if(result == null){
        var obj = {};
        if(req.params.paidType == 'unpaid')
        {
            obj.unpaid = req.body.unpaid;
            if(req.body.unpaid.lobbyAdd.type == "ticket"){
                obj.unpaid.lobbyAdd["ticket"] = req.body.unpaid.lobbyAdd.value;
            }
            else if(req.body.unpaid.lobbyAdd.type == "coin"){
                obj.unpaid.lobbyAdd["coin"] = req.body.unpaid.lobbyAdd.value;
            }
            else if(req.body.unpaid.lobbyAdd.type == "power"){
                obj.unpaid.lobbyAdd["power"] = req.body.unpaid.lobbyAdd.value;
            }
            if(req.body.unpaid.dailyBonus.type == "ticket"){
                obj.unpaid.dailyBonus["ticket"] = req.body.unpaid.dailyBonus.value;
            }
            else if(req.body.unpaid.dailyBonus.type == "coin"){
                obj.unpaid.dailyBonus["coin"] = req.body.unpaid.dailyBonus.value;
            }
            else if(req.body.unpaid.dailyBonus.type == "power"){
                obj.unpaid.dailyBonus["power"] = req.body.unpaid.dailyBonus.value;
            }
        }
        if(req.params.paidType == 'paid'){
            obj.paid = req.body.paid;
            if(req.body.paid.lobbyAdd.type == "ticket"){
                obj.paid.lobbyAdd["ticket"] = req.body.paid.lobbyAdd.value;
            }
            else if(req.body.paid.lobbyAdd.type == "coin"){
                obj.paid.lobbyAdd["coin"] = req.body.paid.lobbyAdd.value;
            }
            else if(req.body.paid.lobbyAdd.type == "power"){
                obj.paid.lobbyAdd["power"] = req.body.paid.lobbyAdd.value;
            }
           if(req.body.paid.dailyBonus.type == "ticket"){
                obj.paid.dailyBonus["ticket"] = req.body.paid.dailyBonus.value;
            }
            else if(req.body.paid.dailyBonus.type == "coin"){
                obj.paid.dailyBonus["coin"] = req.body.paid.dailyBonus.value;
            }
            else if(req.body.paid.dailyBonus.type == "power"){
                obj.paid.dailyBonus["power"] = req.body.paid.dailyBonus.value;
            }
        }
        result = new bingoAdd(obj);
      }
      else{
        if(req.params.paidType == 'unpaid'){
            result.unpaid = req.body.unpaid;
            if(req.body.unpaid.lobbyAdd.type == "ticket"){
                result.unpaid.lobbyAdd["ticket"] = req.body.unpaid.lobbyAdd.value;
            }
            else if(req.body.unpaid.lobbyAdd.type == "coin"){
               result.unpaid.lobbyAdd["coin"] = req.body.unpaid.lobbyAdd.value;
            }
            else if(req.body.unpaid.lobbyAdd.type == "power"){
               result.unpaid.lobbyAdd["power"] = req.body.unpaid.lobbyAdd.value;
            }
            if(req.body.unpaid.dailyBonus.type == "ticket"){
                result.unpaid.dailyBonus["ticket"] = req.body.unpaid.dailyBonus.value;
            }
            else if(req.body.unpaid.dailyBonus.type == "coin"){
               result.unpaid.dailyBonus["coin"] = req.body.unpaid.dailyBonus.value;
            }
            else if(req.body.unpaid.dailyBonus.type == "power"){
               result.unpaid.dailyBonus["power"] = req.body.unpaid.dailyBonus.value;
            }
        }
        if(req.params.paidType == 'paid'){
            result.paid = req.body.paid;
            if(req.body.paid.lobbyAdd.type == "ticket"){
                result.paid.lobbyAdd["ticket"] = req.body.paid.lobbyAdd.value;
            }
            else if(req.body.paid.lobbyAdd.type == "coin"){
               result.paid.lobbyAdd["coin"] = req.body.paid.lobbyAdd.value;
            }
            else if(req.body.paid.lobbyAdd.type == "power"){
               result.paid.lobbyAdd["power"] = req.body.paid.lobbyAdd.value;
            }
            if(req.body.paid.dailyBonus.type == "ticket"){
                result.paid.dailyBonus["ticket"] = req.body.paid.dailyBonus.value;
            }
            else if(req.body.paid.dailyBonus.type == "coin"){
               result.paid.dailyBonus["coin"] = req.body.paid.dailyBonus.value;
            }
            else if(req.body.paid.dailyBonus.type == "power"){
               result.paid.dailyBonus["power"] = req.body.paid.dailyBonus.value;
            }
        }
      }
      bingoAdd.createPaidUnpaid(result, function(err, result) {
        if (!err) {
            return res.json({status:true, result: result});
        } else {
            return res.json({status:false, info:"Unable to get list"});
        }
      });
    });
  }
  else
    return res.json({status:false, info:"Invalid request"});
};

module.exports = bingoAddController;



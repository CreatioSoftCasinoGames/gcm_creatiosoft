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
            var responseData = {};
            if(req.params.paidType == 'unpaid'){
                var responsObject = {};
                if(result.unpaid.level)
                    responsObject.level = result.unpaid.level;
                if(result.unpaid.caps)
                    responsObject.caps = result.unpaid.caps;
                if(result.unpaid.ticket)
                    responsObject.ticket = result.unpaid.ticket;
                else
                    responsObject.ticket = 0;
                if(result.unpaid.coin)
                    responsObject.coin = result.unpaid.coin;
                else
                    responsObject.coin = 0;
                if(result.unpaid.power)
                    responsObject.power = result.unpaid.power;
                else
                    responsObject.power = 0;

                var data = {};
                data['lobbyAdd'] = JSON.parse(JSON.stringify(responsObject));   //will have caps
                data['dailyBonus'] = JSON.parse(JSON.stringify(responsObject));
                data.dailyBonus.caps = undefined;
                responseData = data;
            }
            if(req.params.paidType == 'paid'){
                var responsObject = {};
                if(result.paid.level)
                    responsObject.level = result.paid.level;
                if(result.paid.caps)
                    responsObject.caps = result.paid.caps;
                if(result.paid.ticket)
                    responsObject.ticket = result.paid.ticket;
                else
                    responsObject.ticket = 0;
                if(result.paid.coin)
                    responsObject.coin = result.paid.coin;
                else
                    responsObject.coin = 0;
                if(result.paid.power)
                    responsObject.power = result.paid.power;
                else
                    responsObject.power = 0;

                var data = {};
                data['lobbyAdd'] = JSON.parse(JSON.stringify(responsObject));   //will have caps
                data['dailyBonus'] = JSON.parse(JSON.stringify(responsObject));
                data.dailyBonus.caps = undefined;
                //data['dailyBonus'].caps = undefined;
                responseData = data;
            }
            return res.json({status:true, result: responseData});
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
            obj.unpaid = req.body.unpaid;
        if(req.params.paidType == 'paid')
            obj.paid = req.body.paid;
        result = new bingoAdd(obj);
      }
      else{
        if(req.params.paidType == 'unpaid')
            result.unpaid = req.body.unpaid;
        if(req.params.paidType == 'paid')
            result.paid = req.body.paid;
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



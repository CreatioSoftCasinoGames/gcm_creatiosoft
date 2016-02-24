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
            if(req.params.paidType == 'unpaid')
                responseData = result.unpaid;
            if(req.params.paidType == 'paid')
                responseData = result.paid;

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



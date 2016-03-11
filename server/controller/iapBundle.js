'use strict';

var mongoose = require('mongoose'),
    iapBundle = mongoose.model('iapBundle');

var iapBundleController = {};


/**
   GET: /iapBundle
 */

iapBundleController.getAlliap = function (req,res) {
  	iapBundle.getAlliap(function(err, result){
  		if(err){
  			return res.json({status:false, info:"Oops something went wrong!!"});
  		}
  		else{
  			return res.json({status:true, result: result});
  		}
  	});
};

/**
   GET: /iapBundle
 */

iapBundleController.getAlliapByType = function (req,res) {
  	iapBundle.getAlliapByType(req.params.type, function(err, result){
  		if(err){
  			return res.json({status:false, info:"Oops something went wrong!!"});
  		}
  		else{
  			return res.json({status:true, result: result});
  		}
  	});
};


/**
   GET: /iapBundle/:level
 */

iapBundleController.getByLevelAndTime = function (req,res) {
    if(req.params.level){
      	iapBundle.getiap(req.params.level, req.params.type,function(err, result){
      		if(err){
      			return res.json({status:false, info:"Oops something went wrong!!"});
      		}
      		else{
      			if(result){
	      			var currentTimeStamp = (new Date()).getTime();
	      			if(currentTimeStamp >= result.dealStartDateTime && currentTimeStamp <= result.dealEndDateTime){
	      				var timeRemainingInSecond = Math.round((result.dealEndDateTime - currentTimeStamp)*0.001);

	      				result.dealStartDateTime = undefined;
	      				result.dealEndDateTime = undefined;
	      				result.levelStart = undefined;
	      				result.levelEnd = undefined;
	      				result.__v = undefined;
                result.packType = undefined;

	      				var reso = JSON.parse(JSON.stringify(result));
	      				reso.timeRemaining = timeRemainingInSecond;

	      				return res.json({status:true, result: reso});
	      			}
	      			else
	      				return res.json({status:false, info: "no active deal"}); 				
      			}
      			else{
      				return res.json({status:false, info: "no active deal"});
      			}
      		}
      	});
    }
    else
      return res.json({status:false, info:"Invalid request"});
};

/**
   POST: /iapBundle
*/


iapBundleController.createIapBundle = function (req,res) {
  if(!!req.body.packType && !!req.body.levelStart && !!req.body.levelEnd && !!req.body.packName && !!req.body.originalPrice && !!req.body.newPrice && !!req.body.skuId && !!req.body.dealStartDateTime && !!req.body.dealEndDateTime && !!req.body.purchaseLimit && !!req.body.discountPercent && !!req.body.items){

    if(req.body.levelStart <= req.body.levelEnd){
      if(req.body.dealStartDateTime < req.body.dealEndDateTime){
          iapBundle.chekiapExistByLevelRange(req.body.packType, req.body.levelStart, req.body.levelEnd, function(err, result){
          if(err){
            return res.json({status:false, info:"Oops something went wrong!!"});
          }
          else{
            if(result.length){
              return res.json({status:false, info:"duplicate level range found !!"});
            }
            else{    
                iapBundle.checkForRange(req.body.packType, req.body.levelStart, req.body.levelEnd, function(err, result){
                  if(err){
                    return res.json({status:false, info:"Oops something went wrong!!"});
                  } else{
                      if(result.length){
                        return res.json({status:false, info:"duplicate level range found !!"});
                      }
                      else{
                       iapBundle.createiap(req.body, function(err, result){
                        if(err){
                          
                          return res.json({status:false, info:"Oops something went wrong!!"});
                        }
                        else{
                          return res.json({status:true, result: result});
                        }
                      });
                    }
                  }
              });
            }
          }
        });
      } else {
        return res.json({status:false, info:"Deal Start Date Time should be smaller than Deal End Date Time"});  
      }
    }
    else{
      return res.json({status:false, info:"Level Start should be smaller or equal to Level End"});
    }
  } else {
    return res.json({status:false, info:"Insufficient Data !!"});
  }
};


iapBundleController.updateIapBundle = function (req,res) {
   if(!!req.body.packType && !!req.body.levelStart && !!req.body.levelEnd && !!req.body.packName && !!req.body.originalPrice && !!req.body.newPrice && !!req.body.skuId && !!req.body.dealStartDateTime && !!req.body.dealEndDateTime && !!req.body.purchaseLimit && !!req.body.discountPercent && !!req.body.items){
     if(req.body.levelStart <= req.body.levelEnd){
      if(req.body.dealStartDateTime < req.body.dealEndDateTime){
        iapBundle.getUpdateEntry(req.params.bundleId, function(err, result){
           if(err){
              console.log(err);
              return res.json({status:false, info:"Oops something went wrong!!"});
            } else{
              var dupResult = result;
              iapBundle.removeUpdateEntry(req.params.bundleId, function(err, result){
                 if(err){
                    console.log(err);
                    return res.json({status:false, info:"Oops something went wrong!!"});
                  } else{
                    iapBundle.chekiapExistByLevelRange(req.body.packType, req.body.levelStart, req.body.levelEnd, function(err, result){
                      if(err){
                        console.log(err);
                        createnewRecord(dupResult, function(err, result){
                          return res.json({status:false, info:"Oops something went wrong!!"});
                        });
                      }
                      else{
                        if(result.length){
                          createnewRecord(dupResult, function(err, result){
                            return res.json({status:false, info:"duplicate level range found !!"});
                          });
                        }
                        else{    
                            iapBundle.checkForRange(req.body.packType, req.body.levelStart, req.body.levelEnd, function(err, result){
                              if(err){
                                console.log(err);
                               createnewRecord(dupResult, function(err, result){
                                  return res.json({status:false, info:"Oops something went wrong!!"});
                                });
                              } else{
                                  if(result.length){
                                   createnewRecord(dupResult, function(err, result){
                                      return res.json({status:false, info:"duplicate level range found !!"});
                                    });
                                  }
                                  else{
                                     iapBundle.createiap(req.body, function(err, result){
                                    if(err){
                                      console.log(err);
                                      return res.json({status:false, info:"Oops something went wrong!!"});
                                    }
                                    else{
                                      return res.json({status:true, result: result});
                                    }
                                  });
                                }
                              }
                          });
                        }
                      }
                    });
                  }
              });
            }
          });
        } else {
         return res.json({status:false, info:"Deal Start Date Time should be smaller than Deal End Date Time"});  
      } 
    }else{
       return res.json({status:false, info:"Level Start should be smaller or equal to Level End"});
    }
  }
  else {
    return res.json({status:false, info:"Insufficient Data !!"});
  }
};

function createnewRecord(data, callback){
  data._id = undefined;
  iapBundle.createiap(data, function(err, result){
    if(err){
        console.log(err);
        callback(err);
      }
      else{
        callback(null, result);
      }
    });

}


module.exports = iapBundleController;
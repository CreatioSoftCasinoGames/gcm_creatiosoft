'use strict';

var mongoose = require('mongoose'),
    iapBundle = mongoose.model('iapBundle');

var iapBundleController = {};


// ##  Get Detail of Bundled Paid or Unpaid User

// > GET : /iapBundle/:paidType
// > paidType : Paid or Unpaid

// > Output : Get details of user.

// > User Type : Paid users or Unpaid users.

// > Description : Here we will get list of all user type(paid or unpaid) with individuals details like start level, end level, packname , skuId, Price, Deal time , purchase limit, coupons and their values etc .


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



// ##  Get Detail of Bundled Paid or Unpaid User

// > GET : /iapBundle/:level
// > level : level number 

// > Output : Get active deals for given level.

// > Description : Here we will get active deals for given level depending on the deal end time remained for the same. If no time is remained means no active details left for the given level.


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


// ##  Save Detail of Bundled Paid or Unpaid User

// > POST : /iapBundle

// > Output : Save details of user.

// > User type : Paid or Unpaid

// > Description : Here we save all the details of bundled user(paid or unpaid) like start level, end level, packname, skuId, Price, Deal time, purchase limit, coupons and their values etc after checking all validations like level range, start level can not be greater than end level and same validation for deal date and time etc.

// ** Supporting functions*

// * chekiapExistByLevelRange and checkForRange
// > Here We check the validations for level, date and time i.e level range is already exist or not.

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

// ## Update detail of Bundled Paid or Unpaid User

// > PUT : /iapBundle/update/:bundleId
// > bundleId : Object id for which updation is needed.

// > Output : Update modification done by user.

// > Description : Here we update all the details modified by bundled user(paid or unpaid) after checking all validations like level range, start level can not be greater than end level and same validation for deal date and time etc.

// ** Supporting functions*

// * getUpdateEntry
// > Here we will get detail of record in which updation is made.
// * removeUpdateEntry
// > Here we delete the record from database for which updation is madeafter making a copy.  
// * chekiapExistByLevelRange and checkForRange
// > Here We check the validations for level, date and time for modified data i.e level range is already exist or not.
// * createnewRecord
// > Here we save the modified data if all validation is satisfied otherwise save the data which is copied i.e unmodified data.

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
var crypto  = require('crypto');
var mongoose = require( 'mongoose' );
var shortId = require("shortid");
var express = require('express');
var path    = require('path');
var config = require("../config");
var router = express.Router(),
    multer = require('multer'),
    uploadingPath = config.projectPath+"/public/uploads";

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        console.log("REQUEST OBJECT destination: " + JSON.stringify(request.body));
        callback(null, uploadingPath);
    },
    filename: function (request, file, callback) {
        console.log("REQUEST OBJECT filename: " + JSON.stringify(request.body));
        console.log(file);
        var tempName = (file.originalname).replace(/ /g,'');
            console.log("TEMP NAME : "+tempName);
            tempName = tempName.split(".");
            console.log("Last elements : " + (tempName.length -1))
            var fileExt = tempName[(tempName.length -1)];
            console.log("Extension is : " + fileExt);
            console.log("Custome name : " + request.body.gamename+"."+fileExt);
        var newFName = //tempName[0]+new Date().getTime()+"."+tempName[1];
            request.body.gamename+"."+fileExt;

            console.log("New file name = "+ newFName);
            console.log("FILE Object : " + JSON.stringify(file));
            file.gamename = request.body.gamename;
        callback(null, newFName);
    }
});

var incomingFileFilter = function(req, file, cb){
    console.log("INTO == incomingFileFilter " + JSON.stringify(file));
    var type = file.mimetype;
    console.log("MIME TYPE : " + type);
    var typeArray = type.split("/");
    console.log("B4 validation !!");
    if (typeArray[0] == "video" && ((config.validFileExtention).indexOf(typeArray[1]) > -1)) { // || typeArray[0] == "image"
        console.log("Condition satisfied !!");
        cb(null, true);
    }else {
        console.log("Condition not satisfied !!");
        req.fileValidationError = 'goes wrong on the mimetype';
        cb(null, false, new Error('goes wrong on the mimetype'));
    }
}

var upload = multer({storage: storage,fileFilter:incomingFileFilter}).single('photo');

//Collection
var playerCollection = mongoose.model('player');
var playerHistory = mongoose.model('playerLoggingHistory');
var videoList = mongoose.model('videoList');

//configuration


/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource from user ' + _dirname +"../");
    res.render("../views/index");
});



router.get('/upload',  function(req, res,next) {
    res.render("../views/upload");

});

console.log("PATH : " );

router.post('/upload',function(req, res) {
    upload(req, res, function(err) {
        if(req.fileValidationError){
            res.send(req.fileValidationError);
        } else if(err) {
            console.log('Error Occured');
            res.end('Error Occured');
        } else {
            console.log("/upload : "+ JSON.stringify(req.file));
            videoList.update({gamename:req.file.gamename},
                {$set:
                    {
                        gamename:req.file.gamename,
                        fileName:req.file.filename,
                        lastUpdated:new Date().getTime()
                    }
                },
                {upsert:true},
                function(err,updated){
                    if(!err && updated){
                        console.log('Photo Uploaded ' + JSON.stringify(updated));
                        res.json({status:true,info:'Your File Uploaded'});
                    } else {
                        console.log('NO Photo Uploaded');
                        res.json({status:true,info:'Your File Uploaded'});
                    }
                });
        }

    });
});

// downloading file.
router.get("/download/:filename",function(req,res){
    console.log("Received request for file download : " + req.params.filename);

    videoList.findOne({gamename:req.params.filename},function(err,result){
        if(!err){
            if(!result){
                console.log("No video of this game");
                res.json({status:false,info:"No video of this game"});
            } else{
                console.log("Video available !!");
                var downloadLink = "http://"+config.ip+":"+config.apprunningport+"/uploads/"+result.fileName;
                res.json({status:true,dwLink:downloadLink});
            }
        } else {
            console.log("Something went wrong !! ");
            res.json({status:false,info:"Something went wrong !!"});
        }
    });
});

router.get('/register', function(req, res, next) {
    res.send('register with a resource from user');
});

router.post('/register', function (req, res, next) {
    console.log("Request received for registration " + JSON.stringify(req.body));
    if (!!req.body.name && !!req.body.emailId && !!req.body.password && !!req.body.gameName) {
        playerCollection.findOne({emailId: req.body.emailId}, function (err, result) {
            if (!err && result) {
                console.log("Email Id is already registered !!" + result.emailId);
                res.json({status: false, info: "Email Id is already registered !!"});
            } else {
                var encryptPwd = crypto.publicEncrypt(config.publicKey, new Buffer(req.body.password));
                var encodedPwd = encryptPwd.toString("base64");
                console.log("encoded Pwd : " + encodedPwd);
                var nwPplayer = new playerCollection();
                nwPplayer.name = req.body.name;
                nwPplayer.mobNo = !!req.body.mobNo ? req.body.mobNo : 0000000000;
                nwPplayer.password = encodedPwd;
                nwPplayer.emailId = req.body.emailId;
                nwPplayer.joinedFromGame = req.body.gameName;
                nwPplayer.uniqueToken = shortId.generate();
                nwPplayer.noOfChips = config.defaultChips;
                nwPplayer.noOfSips = config.defaultSips;
                nwPplayer.handsPlayed = 0;
                nwPplayer.handsWon = 0;
                nwPplayer.createdOn = new Date().getTime();
                nwPplayer.lastUpdateOn = new Date().getTime();
                nwPplayer.save(function (err, savedPlayer) {
                    if(!err && savedPlayer)
                    {
                        console.log("Player registered successfully !!" + savedPlayer);
                        res.json({status:true,info:"Player registered successfully !!"});
                    } else {
                        console.log("Player registered un-successfull !!" + err + " Player details Object" + JSON.stringify(nwPplayer));
                        res.json({status:false,info:"Player registered un-successful !!"});
                    }
                });
            }
        });
    } else {
        console.log("One or more mandatory fields are missing !!");
        res.json({status: false, info: "One or more mandatory fields are missing !!", reqBody: req.body});
    }
});

router.post('/login', function (req, res, next) {
    console.log("Request received for login " + JSON.stringify(req.body));
    if (!!req.body.emailId && !!req.body.password && !!req.body.gameName) {
        playerCollection.findOne({emailId:req.body.emailId},
            {name:1,emailId:1,uniqueToken:1,noOfChips:1,noOfSips:1,handsPlayed:1,handsWon:1,_id:-1,password:1},
            function(err,qResult){
            if(!err && qResult){
                var encodedPwd = qResult.password;
                console.log("Encoded Pwd : " + encodedPwd);
                var toBuffer = new Buffer(encodedPwd,"base64");
                var decryptedPwd = crypto.privateDecrypt(config.privateKey,toBuffer);
                console.log("Decrypted Pwd : " + decryptedPwd + " type of " + typeof decryptedPwd);
                if(decryptedPwd.toString() === req.body.password){
                    logPlayerActivityHistory (qResult.emailId,"login",qResult.noOfChips,req.body.gameName,"success");
                    console.log("Login successful for " + qResult.name + " ==> " + qResult.emailId);
                    var ttlSips = 0;
                    qResult.noOfSips.forEach(function(object){
                        ttlSips += object.sips;
                    });
                    qResult["password"] = "";
                    qResult["totalSips"] = ttlSips;
                    console.log("Total Sips " + ttlSips);
                    var tempObj = {isLoggedIn:true,"lastUpdateOn":(new Date().getTime())};
                    playerCollection.findOneAndUpdate({emailId:req.body.emailId},{$set:tempObj},{upsert:false,new:false},function(err,updated){
                        if(!err && updated){
                            console.log("Every thing updated successfully !!" +updated);
                            res.json({status:true,info:"Login successful !!",totalSips:ttlSips, isLoggedIn:updated.isLoggedIn,playerInfo: qResult});
                        } else {
                            console.log("Unexpected error while updating !! " + err);
                            res.json({status: false, info: "Unexpected error while updating !!"});
                        }
                    })

                } else {
                    logPlayerActivityHistory (req.body.emailId,"login",qResult.noOfChips,req.body.gameName,"failed");
                    console.log("Incorrect password entered !!");
                    res.json({status: false, info: "Incorrect password entered !! "});
                }
            } else {
                console.log("We could not find you please register yourself !!");
                res.json({status: false, info: "We could not find you please register yourself !! "});
            }
        });
    } else {
        console.log("One or more mandatory fields are missing !!");
        res.json({status: false, info: "One or more mandatory fields are missing !!", reqBody: req.body});
    }
});

router.post('/ingameupdate',function(req, res, next){
    console.log("Request received for ingameupdate " + JSON.stringify(req.body));
    if(!!req.body.emailId && !!req.body.gameName){
        var noOfChips = !!req.body.noOfChips ? req.body.noOfChips : 0,
            noOfSips  = !!req.body.noOfSips ? req.body.noOfSips : 0,
            handsPlayed = !!req.body.handsPlayed ? req.body.handsPlayed : 0,
            handsWon = !!req.body.handsWon ? req.body.handsWon : 0;
        playerCollection.findOneAndUpdate({emailId:req.body.emailId,"noOfSips.gameName":req.body.gameName},
            {$set:{"noOfSips.$.sips":noOfSips,"noOfChips":noOfChips,"handsPlayed":handsPlayed,"handsWon":handsWon,"lastUpdateOn":new Date().getTime()}},
            {upsert:false,new:true},
            function(err,updtResult){
                if(!err && updtResult){
                    console.log("In game value updated successfully !! " + updtResult);
                    updtResult["password"] = "";
                    var ttlSips = 0;
                    updtResult.noOfSips.forEach(function(object){
                        ttlSips += object.sips;
                    });
                    res.json({status:true,info:"In game value updated successfully !!",noOfSips:updtResult.noOfSips,totalSips:ttlSips,noOfChips:updtResult.noOfChips});
                } else {
                    console.log("Non of Sips not updated !! " + err + " updated result " + updtResult);
                    res.json({status:false,info:"Non of Sips not updated !! " ,reqBody: req.body});
                }
            });
    } else {
        console.log("One or more mandatory fields are missing !!");
        res.json({status: false, info: "One or more mandatory fields are missing !!", reqBody: req.body});
    }

});

router.post('/logout', function (req, res, next) {
    console.log("Request received for logout " + JSON.stringify(req.body));
    var noOfChips = !!req.body.keysToUpdate.noOfChips ? req.body.keysToUpdate.noOfChips : 0,
        noOfSips  = !!req.body.keysToUpdate.noOfSips ? req.body.keysToUpdate.noOfSips : 0,
        handsPlayed = !!req.body.keysToUpdate.handsPlayed ? req.body.keysToUpdate.handsPlayed : 0,
        handsWon = !!req.body.keysToUpdate.handsWon ? req.body.keysToUpdate.handsWon : 0;
    playerCollection.findOneAndUpdate({emailId:req.body.emailId,"noOfSips.gameName":req.body.gameName},
        {
            $set: {
                "noOfSips.$.sips": noOfSips,
                "noOfChips": noOfChips,
                "handsPlayed": handsPlayed,
                "handsWon": handsWon,
                "isLoggedIn": false,
                "lastUpdateOn":new Date().getTime()
            }
        },
        {upsert:false,new:true},
        function(err,updtResult){
            if(!err && updtResult){
                console.log("Values updated successfully !!" + updtResult);
                logPlayerActivityHistory (updtResult.emailId,"logout",updtResult.noOfChips,req.body.gameName,"success");
                res.json({status:true,info:"User logged out !!"});
            } else {
                console.log("Unable to update value !!");
                logPlayerActivityHistory (req.body.emailId,"logout",updtResult.noOfChips,req.body.gameName,"failed");
                res.json({status:false,info:"Unable to update your stats !!"});
            }
        }
    );
});

function logPlayerActivityHistory (emailId,eventType,walletAmount,gameName,attempt){
    var nwActivity = new playerHistory();
    nwActivity.emailId = emailId;
    nwActivity.eventType = eventType;
    nwActivity.walletAmount = walletAmount;
    nwActivity.gameName = gameName;
    nwActivity.attempt = attempt;
    nwActivity.createdOn = new Date().getTime();
    nwActivity.save(function(err,saved){
        if(!err && saved){
            console.log("Activity saved !!");
        } else {
            console.log("Activity could not be saved !!" + err);
        }
    });
}

module.exports = router;

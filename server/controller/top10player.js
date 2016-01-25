'use strict';

var mongoose = require('mongoose'),
    top10player = mongoose.model('top10player');

var _ = require('underscore');



/**
   GET: /top10player
 */

exports.getAll = function (req,res,next) {
  console.log("Request for GET top10player : " + JSON.stringify(req.body));

    var date = new Date();
        date.setHours(0,0,0,0);

    var query = {
        gameId: "gameId",
        gameName: "gameName",
        date: { $gt: date.getTime() }
    }
    top10player.getAll(query, function(err, result) {
      if (!err) {
          return res.json({status:true, result: result});
      } else {
          return res.json({status:false, info: "unable to get list"});
      }
    });

};


/**
   POST: /top10player
 */

exports.create = function (req,res,next) {
  console.log("Request for creating top10player : " + JSON.stringify(req.body));
    var date = new Date();
        date.setHours(0,0,0,0);
    var query = {
        gameId: "gameId",
        gameName: "gameName",
        date: { $gt: date.getTime() }
    }


    top10player.getAll(query, function(err, result) {
      if (!err) {
          
          var track1List = [];
          var track2List = [];
          var track3List = [];

          if(result){
              if(result.top10playerTrack1)
                  track1List = result.top10playerTrack1;
              if(result.top10playerTrack2)
                  track2List = result.top10playerTrack2;
              if(result.top10playerTrack3)
                  track3List = result.top10playerTrack3;
          }
          
          for(var i = 0; i< req.body.length; i++){
            if(req.body[i].trackName == "track1"){
                track1List.push(req.body[i]);
            }
            if(req.body[i].trackName == "track2"){
                track2List.push(req.body[i]);
            }
            if(req.body[i].trackName == "track3"){
                track3List.push(req.body[i]);
            }
          }

          track1List = _.sortBy(track1List, function(o) {
              return o.time;
          });

          track2List = _.sortBy(track2List, function(o) {
              return o.time;
          });

          track3List = _.sortBy(track3List, function(o) {
              return o.time;
          });

          track1List = track1List.splice(0, 10);
          track2List = track2List.splice(0, 10);
          track3List = track3List.splice(0, 10);


          createtop10player(track1List, track2List, track3List, function(err, player){
              if (!err) {
                  return res.json({status:true,result: "Successfully updated"});
              } else {
                  return res.json({status:false,info:"Unable to update"});
              }
          });
      } else {
          return res.json({status:false, info: "unable to get list"});
      }
    });
};

function createtop10player(track1List, track2List, track3List, callback){
    var data = {
      gameId: "gameId",
      gameName: "gameName",
      date: new Date().getTime(),
      top10playerTrack1: track1List,
      top10playerTrack2: track2List,
      top10playerTrack3: track3List
    }
    top10player.createtop10player(data, function(err, result) {
        callback(err, result);
    });
}


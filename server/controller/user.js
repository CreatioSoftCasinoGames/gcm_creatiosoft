'use strict';

/**
 * Created by gaurav on 15/1/16.
 */

// # Moral Dilemma Controller
// ## user.js 
// ## path: server/controller/user.js

var connection = require('../config/db').connection,
    databaseName = require('../config/config').database.database,
    uuid = require('uuid');

// ## Get Question List to be shown on game based on level

// > GET : /questions?level=1

// > Response: Question List to be shown on game based on level

exports.getQuestionList = function(req, res){
    console.log("Request for getQuestionList : Level --> " + req.query.level);
    var level = req.query.level;

    if(!level) res.json({status:false, info: "Insufficient information !!"});
    else{
        var query = "SELECT options.Question_Id, options.Option_Id, options.Level,  options.Option_String, questions.Question_String"+
                    " FROM options INNER JOIN questions "+
                    "ON options.Question_Id=questions.Question_Id WHERE options.Level = "+level;

        connection.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.json({status:false, info: "Opps something went wrong !!"});
            } else {
                res.json({status:true, result:result});
            }

        });
    }
};


// ## Register new user

// > POST : /registerUser

// > Body : User_Name, Unique_User_Id, User_Type

// > Response: User_Id, Round_Id

// > Description: There will be 2 case:
// > 1. When new user first time sign in -> will create a new user in our db with above fields which we get from facebook and google sign in and will return User_Id and Round_Id
// > 2. When existing user starts new game -> will not create new user in db but will provide/return new Round_Id with existing User_Id

exports.registerUser = function(req, res){
    console.log("Request for registerUser: " + JSON.stringify(req.body));
    if(!!req.body.User_Name && !!req.body.Unique_User_Id && !!req.body.User_Type) {

        req.body.Created_On = (new Date()).getTime();
        req.body.Updated_On = (new Date()).getTime();

        var query = "SELECT * FROM moralDilemma.users " +
            "WHERE Unique_User_Id='" + req.body.Unique_User_Id+"'";

        connection.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.json({status:false, info: "Opps something went wrong !!"});
            } else {
                if(result.length){
                    var obj = {
                        User_Id : result[0].User_Id,
                        Round_Id: uuid.v1()
                    }
                    console.log("Response of registerUser"+ JSON.stringify(obj));
                    res.json({status:true, result: obj});
                }
                else{
                    var query = "INSERT INTO moralDilemma.users (User_Name, Unique_User_Id, User_Type, Created_On, Updated_On) VALUES (?,?,?,?,?)";

                    var values = [req.body.User_Name, req.body.Unique_User_Id, req.body.User_Type, req.body.Created_On, req.body.Updated_On];

                    connection.query(query, values, function(err, result) {
                        var obj = {
                            User_Id : result.insertId,
                            Round_Id: uuid.v1()
                        }
                        console.log("Response of registerUser"+ JSON.stringify(obj));
                        res.json({status:true, result: obj});
                    });
                }
            }

        });
        
    } else{
        res.json({status:false, info: "Insufficient information !!"});
    }
};

// ## Register Answer

// > POST : /registerAnswers

// > Body : array of 4 object(option) having User_Id, Round_Id, Question_Id, Option_Id, Option_Value, Is_Final, Time_Spend

// > Response: Successfull Response

// > Description: Is_Final key will be 0 from client end if not final answer and 1 if final answer

exports.registerAnswers = function(req, res){
    console.log("Request for registerAnswers: " + JSON.stringify(req.body));
    var query = "INSERT INTO moralDilemma.answers (User_Id, Round_Id, Question_Id, Option_Id, Option_Value, Is_Final, Time_Spend, Created_On, Updated_On) values ";
    for(var i =0; i<req.body.length; i++){  
        if(!!req.body[i].User_Id && !!req.body[i].Round_Id && !!req.body[i].Question_Id && !!req.body[i].Option_Id && !!req.body[i].Option_Value  && !!req.body[i].Time_Spend ) {

            req.body[i].Created_On = (new Date()).getTime();
            req.body[i].Updated_On = (new Date()).getTime();
           
           var localValue = "("+req.body[i].User_Id+",'"+req.body[i].Round_Id+"',"+req.body[i].Question_Id+","+req.body[i].Option_Id+",'"+req.body[i].Option_Value+"',"+req.body[i].Is_Final+","+req.body[i].Time_Spend+","+req.body[i].Created_On+","+ req.body[i].Updated_On+")";

            if(i!= req.body.length-1)
                localValue = localValue+", ";
            else
                localValue = localValue+";"

            query = query+localValue;

            
        } else{
            console.log(query);
            return res.json({status:false, info: "Insufficient information !!"});
        }
    }
    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);
            res.json({status:false, info: "Opps something went wrong !!"});
        } else {
            res.json({status:true, result:result});
        }
    });
};

// ## Register Incomplete Answer Event

// > POST : /registerIncompleteAnswer

// > Body : User_Id, Round_Id, Question_Id

// > Response: Successfull Response

// > Description: Will register each attempt for answer submittion which are incomplete/incorrect 

exports.registerIncompleteAnswer = function(req, res){
    console.log("Request for registerIncompleteAnswer: " + JSON.stringify(req.body));

    if(!!req.body.User_Id && !!req.body.Round_Id && !!req.body.Question_Id) {

        req.body.Created_On = (new Date()).getTime();
        req.body.Updated_On = (new Date()).getTime();

        var SP_CALL = "CALL registerIncompleteAnswer("+req.body.User_Id+",'"+req.body.Round_Id+"',"+req.body.Question_Id+","+req.body.Created_On+","+req.body.Updated_On+");";
        console.log(SP_CALL);

        connection.query(SP_CALL, function(err, rows)
        {
          if (err){
            console.log(err);
            console.log("Fail to register incomplete answer analytic");
            res.json({status:true, info: "Fail to register incomplete answer analytic"});
          }
          else{
            console.log(rows);            
            console.log("Successfully registered incomplete answer analytic");
            res.json({status:true, info: "Successfully registered incomplete answer analytic"});
          }

        });
        
    } else{
        console.log(query);
        return res.json({status:false, info: "Insufficient information !!"});
    }
};

// ## Register Log

// > POST : /registerLog

// > Body : User_Id, Round_Id, Log_Type

// > Response: Successfull Response

// > Description: Will register log/event for every User_Id and Round_Id 

exports.registerLog = function(req, res){
    console.log("Request for registerLog: " + JSON.stringify(req.body));

    if(!!req.body.User_Id && !!req.body.Round_Id && !!req.body.Log_Type) {

        req.body.Created_On = (new Date()).getTime();
        req.body.Updated_On = (new Date()).getTime();

        var Comment = !!req.body.Comment ? req.body.Comment : "No Comment";

        var SP_CALL = "CALL registerLog("+req.body.User_Id+",'"+req.body.Round_Id+"','"+req.body.Log_Type+"','"+req.body.Comment+"',"+req.body.Created_On+","+req.body.Updated_On+");";
        console.log(SP_CALL);

        connection.query(SP_CALL, function(err, rows)
        {
          if (err){
            console.log(err);
            console.log("Fail to register log analytic");
            res.json({status:true, info: "Fail to register log analytic"});
          }
          else{
            console.log(rows);            
            console.log("Successfully registered log analytic");
            res.json({status:true, info: "Successfully registered log analytic"});
          }

        });          
    } else{
        console.log(query);
        return res.json({status:false, info: "Insufficient information !!"});
    }
};

// ## Register App Loading Time

// > POST : /registerLoadingTime

// > Body : User_Id, Round_Id, Time_Taken

// > Response: Successfull Response

// > Description: Will log app loading time. Here User_Id and Round_Id are optional

exports.registerLoadingTime = function(req, res){
    console.log("Request for registerLoadingTime: " + JSON.stringify(req.body));
    if(!!req.body.Time_Taken) {
        req.body.Created_On = (new Date()).getTime();
        req.body.Updated_On = (new Date()).getTime();

        var SP_CALL = "CALL registerLoadingTime("+req.body.User_Id+",'"+req.body.Round_Id+"',"+req.body.Time_Taken+","+req.body.Created_On+","+req.body.Updated_On+");";
        console.log(SP_CALL);

        connection.query(SP_CALL, function(err, rows)
        {
          if (err){
            console.log(err);
            console.log("Fail to register app loading time analytic");
            res.json({status:true, info: "Fail to register app loading time analytic"});
          }
          else{
            console.log(rows);            
            console.log("Successfully registered app loading time analytic");
            res.json({status:true, info: "Successfully registered app loading time analytic"});
          }

        }); 

    } else{
        console.log(query);
        return res.json({status:false, info: "Insufficient information !!"});
    }

};

// ## Get Screen List

// > GET : /getScreenEvent

// > Response: array of [Screen_Id, Screen_Name]

// > Description: Get Screen List whose time is to be recorded in other request

exports.getScreen = function(req, res){
    console.log("Request for getScreen");
        
    var SP_CALL = "CALL getScreen();";
    console.log(SP_CALL);

    connection.query(SP_CALL, function(err, rows)
    {
      if (err){
        console.log(err);
        console.log("Fail to get screen list");
        res.json({status:true, info: "Fail to get screen list"});
      }
      else{
        console.log(rows[0]);
        res.json({status:true, result: rows[0]});
      }

    }); 
};

// ## Record Screen Event

// > POST : /recordScreen

// > Body: User_Id, Round_Id, Screen_Id, Time_Spend 

// > Response: Successful Response

// > Description: Record Screen Event time 

exports.recordScreen = function(req, res){
    console.log("Request for recordScreen: "+ JSON.stringify(req.body));
    if(!!req.body.User_Id && !!req.body.Round_Id && !!req.body.Screen_Id && !!req.body.Time_Spend) {
        req.body.Created_On = (new Date()).getTime();
        req.body.Updated_On = (new Date()).getTime();

        var SP_CALL = "CALL recordScreen("+req.body.User_Id+",'"+req.body.Round_Id+"',"+req.body.Screen_Id+","+req.body.Time_Spend+","+req.body.Created_On+","+req.body.Updated_On+");";
        console.log(SP_CALL);

        connection.query(SP_CALL, function(err, rows)
        {
          if (err){
            console.log(err);
            console.log("Fail to record screen analytic");
            res.json({status:true, info: "Fail to record screen analytic"});
          }
          else{
            console.log(rows);            
            console.log("Successfully recorded screen analytic");
            res.json({status:true, info: "Successfully recorded screen analytic"});
          }

        }); 

    } else{
        console.log(query);
        return res.json({status:false, info: "Insufficient information !!"});
    }
};
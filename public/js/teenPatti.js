angular.module('teen-patti', []).controller('TeenPattiController', ['$scope', '$window', function ($scope, $window) {

    $scope.rooms = [];
    $scope.tables = [];
    $scope.deck = [];
    $scope.seats = [];
    $scope.enabledPlayers = [];
    $scope.newPlayers = [];
    $scope.transactions = [];
    $scope.withHistories = [];
    $scope.agents = [];
    $scope.numPlayers = 0;
    $scope.totalBingosLeft = 0;
    $scope.totalCards = 0;
    $scope.playerId = null;
    $scope.playerSeatIndex = null;
    $scope.sidPlayer = null;
    $scope.gameStart = null;
    $scope.tempRoomId = null;
    $scope.tempBootAmt = null;
    $scope.tempRoomName = null;
    $scope.tempMaxPlayer = null;
    $scope.tempMinAmt = null;
    $scope.tempMaxAmt = null;
    $scope.tempPotLimit = null;
    $scope.tempBlindLimit = null;
    $scope.tempChaalLimit = null;
    $scope.playerName = null;
    $scope.tempPwd = null;
    $scope.tempCoin = null;
    $scope.chaalAmount = null;
    $scope.blindAmount = null;
    $scope.nextPlayerId = null;
    $scope.channelId = null;
    $scope.adminAmout = null;
    $scope.authToken = null;
    $scope.agentName = null;
    $scope.agentMob = null;
    $scope.agentPwd = null;
    $scope.agentComm = null;
    $scope.agentState = null;
    $scope.agentDist = null;
    $scope.agentPin = null;
    $scope.agentAdd = null;
    $scope.usrRole = null;
    $scope.usrRefId = null;
    $scope.trfAgent = null;
    $scope.trfAmount = null;

    $scope.signIn = function () {
        $.post("signin", {
            username: $scope.playerName,
            pwd: $scope.tempPwd
        }, function (data, status) {
            console.log("Date received from server " + JSON.stringify(data));
            $scope.playerName = null;
            $scope.tempPwd = null;
            if (data.status) {
                //$scope.constMenu(data.options);
                $scope.authToken = data.authToken;
                $scope.usrRole = data.roleId;
                $scope.usrRefId = data.userId;
                if($scope.usrRole != 103){
                    console.log("---------When Not 103-------------");
                    $("#adminname").text(data.name);
                    $("#admintoken").text(data.role);
                    myTeenPatti.showHeadPartial(".adminheader");
                    $scope.getAllRooms();
                    $scope.getAdminAccDetail();
                    myTeenPatti.showPartial(".allrooms");
                } else {
                    console.log("---------When 103-------------");
                    $("#name").text(data.name);
                    $("#token").text(data.role);
                    myTeenPatti.showHeadPartial(".agentheader");
                    $scope.getAdminAccDetail();
                    $scope.getNewPlayer();
                }
            } else {
                alert(data.info);
            }
        });
    };
    
    /* ------------------------------------Analytics Starts Here -------------------------------*/

    $scope.dropBetweenRangeOfAdmin = function () {
        $scope.adminDropData.adminId = $scope.usrRefId;
        $scope.adminDropData.authToken = $scope.authToken;

        if($scope.adminDropData){
            if(!$scope.adminDropData.adminId || !$scope.adminDropData.startDate || !$scope.adminDropData.criteria)
                alert("Insufficient data");
            else{
                if(isValidDate($scope.adminDropData.startDate)){
                    //$scope.data.startDate = (new Date($scope.data.startDate)).getTime();

                    var startDate= (new Date($scope.adminDropData.startDate)).getTime();
                    var endDate = new Date($scope.adminDropData.startDate);
                    endDate.setDate(endDate.getDate() + 1);
                    endDate = endDate.getTime();


                    if($scope.adminDropData.criteria == "weekly"){
                        var firstDay = new Date($scope.adminDropData.startDate);
                        endDate = (new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000)).getTime();
                    }

                    if($scope.adminDropData.criteria == "monthly"){
                        var now = new Date($scope.adminDropData.startDate);
                        if (now.getMonth() == 11) {
                            endDate = (new Date(now.getFullYear() + 1, 0, 1)).getTime();
                        } else {
                            endDate = (new Date(now.getFullYear(), now.getMonth() + 1, 1)).getTime();
                        }
                    }

                   $scope.message = "From "+$scope.adminDropData.startDate+" to "+ formatDate(endDate);

                   $.post("dropBetweenRangeOfAdmin",
                        {"adminId": $scope.adminDropData.adminId, "startDate": startDate, "endDate": endDate, "authToken": $scope.adminDropData.authToken},
                        function (data, status) {
                            if (data.status) {
                                if(!data.result.length){
                                  console.log("No Data Found");
                                  $scope.adminDrops = data.result;
                                  alert("No data found");                                  
                                }
                                else
                                    $scope.adminDrops = data.result;
                            } else {
                                console.log("Unable to get data");
                                alert("Unable to get data");
                            }

                        });
                }               
            }
        }
        else{
            alert("Please fill the data");
        }
    };

    $scope.dropBetweenRangeOfAdminFromAgent = function () {
        $scope.adminDropAgentData.adminId = $scope.usrRefId;
        $scope.adminDropAgentData.authToken = $scope.authToken;

        if($scope.adminDropAgentData){
            if(!$scope.adminDropAgentData.adminId || !$scope.adminDropAgentData.startDate || !$scope.adminDropAgentData.criteria || !$scope.adminDropAgentData.agentId)
                alert("Insufficient data");
            else{
                if(isValidDate($scope.adminDropAgentData.startDate)){

                    var startDate= (new Date($scope.adminDropAgentData.startDate)).getTime();
                    var endDate = new Date($scope.adminDropAgentData.startDate);
                    endDate.setDate(endDate.getDate() + 1);
                    endDate = endDate.getTime();


                    if($scope.adminDropAgentData.criteria == "weekly"){
                        var firstDay = new Date($scope.adminDropAgentData.startDate);
                        endDate = (new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000)).getTime();
                    }

                    if($scope.adminDropAgentData.criteria == "monthly"){
                        var now = new Date($scope.adminDropAgentData.startDate);
                        if (now.getMonth() == 11) {
                            endDate = (new Date(now.getFullYear() + 1, 0, 1)).getTime();
                        } else {
                            endDate = (new Date(now.getFullYear(), now.getMonth() + 1, 1)).getTime();
                        }
                    }

                   $scope.message = "From "+$scope.adminDropAgentData.startDate+" to "+ formatDate(endDate);

                   $.post("dropBetweenRangeOfAdminFromAgent",
                        {"adminId": $scope.adminDropAgentData.adminId, "agentId": $scope.adminDropAgentData.agentId, "startDate": startDate, "endDate": endDate, "authToken": $scope.adminDropAgentData.authToken},
                        function (data, status) {
                            if (data.status) {
                                if(!data.result.length){
                                  console.log("No Data Found");
                                  $scope.adminDropsByAgent = data.result;
                                  alert("No data found");                                  
                                }
                                else
                                    $scope.adminDropsByAgent = data.result;
                            } else {
                                console.log("Unable to get data");
                                alert("Unable to get data");
                            }

                        });
                }               
            }
        }
        else{
            alert("Please fill the data");
        }
    };

    $scope.getTop20PlayerDropWithAgent = function(){
        $.post("getTop20PlayerDropWithAgent",
            {"authToken": $scope.authToken},
            function (data, status) {
                if (data.status) {
                    console.log(data.result);
                    if(!data.result.length){
                      console.log("No Data Found");
                      $scope.drops = data.result;
                      alert("No data found");                                  
                    }
                    else
                        $scope.top20PlayerDrop = data.result;
                } else {
                    console.log("Unable to get data");
                    alert("Unable to get data");
                }
        });
    }

    $scope.getTop10PlayerDropForParticularAgent = function(){
        if(!$scope.top10PlayerData.agentId) alert("Please provide Agent Id");
        else{
            $.post("getTop10PlayerDropForParticularAgent",
            { agentId: $scope.top10PlayerData.agentId, "authToken": $scope.authToken },
            function (data, status) {
                    if (data.status) {
                        if(!data.result.length){
                          console.log("No Data Found");
                          $scope.drops = data.result;
                          alert("No data found");                                  
                        }
                        else{
                            console.log(data.result);
                            $scope.top10Playerdrops = data.result;
                        }
                    } else {
                        console.log("Unable to get data");
                        alert("Unable to get data");
                    }
            });
        }
    }

    $scope.getTop10PlayerDropForAgent = function(){
        if(!$scope.usrRefId) alert("Please provide Agent Id");
        else{
            $.post("getTop10PlayerDropForParticularAgent",
            { agentId: $scope.usrRefId, "authToken": $scope.authToken },
            function (data, status) {
                    if (data.status) {
                        if(!data.result.length){
                          console.log("No Data Found");
                          $scope.drops = data.result;
                          alert("No data found");                                  
                        }
                        else{
                            console.log(data.result);
                            $scope.top10PlayerAgentDrops = data.result;
                        }
                    } else {
                        console.log("Unable to get data");
                        alert("Unable to get data");
                    }
            });
        }
    }

    $scope.getGetTipAmountByAdmin = function(){
        if(!$scope.usrRefId) alert("Please provide Admin Id");
        else{
            $.post("getGetTipAmountByAdmin",
            {adminId: $scope.usrRefId, authToken: $scope.authToken},
            function (data, status) {
                    if (data.status) {
                            $scope.tipEarned = data.result[0].tipEarned;
                    } else {
                        console.log("Unable to get data");
                        alert("Unable to get data");
                    }
            });

        }
    }

    $scope.getAllTransactionForAgent = function(){
        if(!$scope.playerId) alert("Please provide player Id");
        else{
            $.post("getAllTransactionForAgent",
            {playerId: $scope.playerId, authToken: $scope.authToken},
            function (data, status) {
                    if (data.status) {
                            $scope.agentTransaction = data.result;
                            console.log($scope.agentTransaction);                               
                       
                    } else {
                        console.log("Unable to get data");
                        alert("Unable to get data");
                    }
            });

        }
    }

/* ------------------------------------Analytics Ends Here -------------------------------*/

    $scope.constMenu = function(options){
        console.log("constMenu called");
        var div = $("<div></div>").addClass("navbar-collapse collapse navbar-responsive-collapse pull-right");
        var ul = $("<ul></ul>").addClass("nav navbar-nav");
        console.log("UL created")
        for(var i = 0; i< options.length; i++){
            ul.append($("<li></li>").attr(options[i]));
        }
        console.log("Loop executed !!");
        div.append(ul);
        $("#custnavbar").append(div);
        console.log("DOM appended !!");
    };

    $scope.Logout = function(){
        $scope.rooms = [];
        $scope.tables = [];
        $scope.deck = [];
        $scope.seats = [];
        $scope.enabledPlayers = [];
        $scope.newPlayers = [];
        $scope.numPlayers = 0;
        $scope.totalBingosLeft = 0;
        $scope.totalCards = 0;
        $scope.usrRole = null;
        $scope.usrRole = null;
        $scope.usrRefId = null;
        $scope.playerId = null;
        $scope.playerSeatIndex = null;
        $scope.sidPlayer = null;
        $scope.gameStart = null;
        $scope.tempRoomId = null;
        $scope.tempBootAmt = null;
        $scope.tempRoomName = null;
        $scope.tempMaxPlayer = null;
        $scope.tempMinAmt = null;
        $scope.tempMaxAmt = null;
        $scope.tempBlindLimit = null;
        $scope.tempPotLimit = null;
        $scope.tempChaalLimit = null;
        $scope.playerName = null;
        $scope.tempPwd = null;
        $scope.tempCoin = null;
        $scope.chaalAmount = null;
        $scope.blindAmount = null;
        $scope.nextPlayerId = null;
        $scope.channelId = null;
        $scope.adminAmout = null;
        $scope.authToken = null;
        $scope.agentName = null;
        $scope.agentMob = null;
        $scope.agentPwd = null;
        $scope.agentComm = null;
        $scope.agentState = null;
        $scope.agentDist = null;
        $scope.agentPin = null;
        $scope.agentAdd = null;
        $scope.trfAgent = null;
        $scope.trfAmount = null;
        $("#name").text("");
        $("#token").text("");
        $("#accbal").text("");
        myTeenPatti.hideHeader();
        myTeenPatti.showPartial(".sign_in");
        //$location.path("/");
        console.log("Hostname : " + window.location.hostname);

    };

    $scope.getRooms = function () {
        $scope.playerId = $("#token").text();
        $scope.playerName = $("#name").text();
        window.pomelo.request("connector.entryHandler.getAllExistingTables", {
            playerId: $scope.playerId,
            playerEmail: "prateek@gmail.com"
        }, function (data) {
            console.log(data);
            console.log(data.rooms);
            if (data.status && data.rooms.length > 0) {
                console.log(' I am here !!')
                for (var i = 0; i < data.rooms.length; i++) {
                    data.rooms[i].id = data.rooms[i]._id
                }
                console.log(data.rooms)
                myTeenPatti.showPartial(".rooms");
                $scope.$apply(function () {
                    $scope.rooms = data.rooms;
                });
            }
        });
    };

    $scope.showTables = function (tableConfigId) {
        window.pomelo.request("connector.entryHandler.getChannelsOfRoom", {
            playerId: $scope.playerId,
            tableReference: tableConfigId
        }, function (data) {
            console.log(data);
            if (data.status && data.channels.length > 0) {
                console.log(' I am here !!');
                for (var i = 0; i < data.channels.length; i++) {
                    data.channels[i].id = data.channels[i]._id
                }
                console.log(data.channels);
                myTeenPatti.showPartial(".tables");
                $scope.$apply(function () {
                    $scope.tables = data.channels;
                });
            }
        });
    };

    $scope.joinTable = function (tableId) {
        window.pomelo.request("connector.entryHandler.joinChannel", {
            playerId: $scope.playerId,
            channelId: tableId,
            playerName: $scope.playerName
        }, function (data) {
            console.log(data)
            myTeenPatti.showPartial(".board");
            $scope.$apply(function () {
                $scope.totalPlayers = data.noOfPlayers;
                $scope.channelId = data.channelId;
                $scope.playerId = !!data.gameData.playerId ? data.gameData.playerId : "Value Missing!";
                $scope.pot = !!data.gameData.potAmount ? data.gameData.potAmount : "Value missing!";
            });
        })
    };

    $scope.sit = function (channelId) {
        // var amount = prompt("Enter total amount!");
        if ($scope.playerId == "V1IDiIODe") {
            $scope.playerSeatIndex = 0;
        } else if ($scope.playerId == "E1Z6s8uPe") {
            $scope.playerSeatIndex = 1;
        } else {
            $scope.playerSeatIndex = 2;
        }
        // $scope.playerSeatIndex = $scope.playerId == "N1rA4oQSg" ? 0 : 1;
        // $scope.playerSeatIndex = $scope.playerId == "VkLrxoESx" ? 0 : 1;
        window.pomelo.request("connector.entryHandler.sitHere", {
            channelId: $scope.channelId,
            playerName: $scope.playerName,
            playerAvatarId: "",
            playerSeatIndex: $scope.playerSeatIndex,
            playerId: $scope.playerId,
            buyInAmount: 500
        }, function (data) {
            console.log(data);
            $scope.sidPlayer = data.sidPlayer;
        })
    };

    $scope.chaal = function (channelId) {
        var amount = prompt("Please enter the amount")
        pomelo.request("connector.entryHandler.playChaal", {
            channelId: $scope.channelId,
            amount: amount,
            sidPlayer: $scope.sidPlayer,
            playerSeatIndex: $scope.playerSeatIndex,
            playerId: $scope.playerId
        }, function (data) {
            console.log(data)
        });
    }

    $scope.blind = function (channelId) {
        var amount = prompt("Please enter the amount");
        pomelo.request("connector.entryHandler.playBlind", {
            channelId: channelId,
            amount: amount,
            playerSeatIndex: $scope.playerSeatIndex,
            sidPlayer: $scope.sidPlayer,
            playerId: $scope.playerId
        }, function (data) {
            console.log(data)
        });
    }

    $scope.pack = function (channelId) {
        pomelo.request("connector.entryHandler.playerPack", {
            channelId: $scope.channelId,
            playerSeatIndex: $scope.playerSeatIndex,
            sidPlayer: $scope.sidPlayer,
            playerId: $scope.playerId
        }, function (data) {
            console.log(data)
        });
    }

    $scope.leave = function (channelId) {
        window.pomelo.request("connector.entryHandler.leaveChannel", {
            channelId: channelId,
            playerId: $scope.playerId,
            playerSeatIndex: $scope.playerSeatIndex,
            sidPlayer: $scope.sidPlayer,
            playerId: $scope.playerId
        }, function (data) {
            myTeenPatti.showPartial(".tables");
            console.log(data)
        })
    };

    var listenCallbacks = function () {

        window.pomelo.on("gameOver", function (data) {
            alert('Game is over !');
        });

        window.pomelo.on("gameStarted,", function (data) {
            console.log('Game is started!');
            console.log(data);
            $scope.nextPlayerId = !!data.playerMoveId ? data.playerMoveId : "Value Missing!";
            $scope.pot = !!data.pot ? data.pot : "Value Missing!";
        });

        window.pomelo.on("playerTurn", function (data) {
            console.log(data);
            $scope.chaalAmount = !!data.lastChaalAmt ? data.lastChaalAmt : "Value Missing!";
            $scope.blindAmount = !!data.lastBlindAmt ? data.lastBlindAmt : "Value Missing!";
            $scope.nextPlayerId = !!data.nextPlayerMove ? data.nextPlayerMove : "Value Missing!";
        });

        function generateAuthToken() {
            console.log("Genetare Auth TOken Called !!");
            $.post("genauthtoken",
                {memberCode: $scope.usrRefId},
                function (data, status) {
                    if (data.status) {
                        console.log("Auth response " + JSON.stringify(data));
                        $scope.authToken = data.authToken;
                    } else {
                        console.log("status false !!");
                    }

                });
        }

        //generateAuthToken();

    };

    $scope.getNewPlayer = function () {
        if($scope.authToken){
            $.post("getnewplayers",
                {
                    authToken: $scope.authToken,
                    memberCode: $scope.usrRefId,
                    lowerLimit: 20
                },
                function (data, status) {
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status && !!data.newPlayers && data.newPlayers.length > 0) {
                        console.log(' I am here !!');
                        for (var i = 0; i < data.newPlayers.length; i++) {
                            data.newPlayers[i].id = data.newPlayers[i]._id
                        }
                        console.log(data.newPlayers);
                        myTeenPatti.showPartial(".newregistrations");
                        $scope.$apply(function () {
                            $scope.newPlayers = data.newPlayers;
                        });
                    } else {
                        alert(data.info);
                        myTeenPatti.showPartial(".newregistrations");
                        $scope.$apply(function () {
                            $scope.newPlayers = null;
                        });
                    }

                });
        } else {
            alert("Please login into system using your credential !!");
        }
        //console.log("Got clicked !!");

    };

    $scope.doEnable = function (playerId) {
        //console.log("Got clicked do enable!! for " + playerId);
        if($scope.authToken){
            $.post("toggleplayingstatus",
                {
                    authToken: $scope.authToken,
                    playerToken: playerId,
                    enablingStatus: true,
                    memberCode: $scope.usrRefId
                },
                function (data, status) {
                    if (data.status) {
                        alert("Player is enabled !!");
                        $scope.getNewPlayer();
                    } else {
                        alert(data.info);
                    }

                });
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.getEnabledPlayer = function () {
        //console.log("getEnabledPlayer Got clicked !!");
        if($scope.authToken){
            $.post("getenabledplayer",
                {
                    authToken: $scope.authToken,
                    memberCode: $scope.usrRefId,
                    lowerLimit: 20
                },
                function (data, status) {
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status && data.enabledPlayers.length > 0) {
                        //console.log(' I am here !!');
                        for (var i = 0; i < data.enabledPlayers.length; i++) {
                            data.enabledPlayers[i].id = data.enabledPlayers[i]._id
                        }
                        //console.log(data.enabledPlayers);
                        myTeenPatti.showPartial(".enabledplayer");
                        $scope.$apply(function () {
                            $scope.enabledPlayers = data.enabledPlayers;
                        });
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });
        } else {
            alert("Please login into system using your credential !!");
        }

    };

    $scope.doDisable = function (playerId) {
        //console.log("doDisable Got clicked !!");
        if($scope.authToken){
            $.post("toggleplayingstatus",
                {
                    authToken: $scope.authToken,
                    playerToken: playerId,
                    enablingStatus: false,
                    memberCode: $scope.usrRefId
                },
                function (data, status) {
                    if (data.status) {
                        alert("Player is disable !!");
                        $scope.getEnabledPlayer();
                    } else {
                        alert(data.info);
                    }

                });
        } else {
            alert("Please login into system using your credential !!");
        }

    };

    $scope.getAllRooms = function () {
        //console.log("getAllRooms Got clicked !!");
        if($scope.authToken){
            if($scope.usrRole != 103 && $scope.usrRole != null){
                $.post("getbasictable",
                    {
                        authToken: $scope.authToken
                    },
                    function (data, status) {
                        console.log("Rooms: " + JSON.stringify(data) + "\nStatus: " + status);
                        if (data.status && data.rooms.length > 0) {
                            console.log(' I am here !!');
                            for (var i = 0; i < data.rooms.length; i++) {
                                data.rooms[i].id = data.rooms[i]._id
                            }
                            console.log(data.rooms);
                            myTeenPatti.showPartial(".allrooms");
                            $scope.$apply(function () {
                                $scope.rooms = data.rooms;
                            });
                        } else {
                            alert(data.info);
                        }

                    });
            } else {
                alert("You are not authorized for this page !!");
            }
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.editRoomConfig = function (roomId, roomName, bootAmt, minAllowed, maxAllowed, maxPlayer, chaalLimit,blindLimit, potLimit) {
        if($scope.authToken){
            if($scope.usrRole != 103 && $scope.usrRole != null){
                console.log("Received Input !!" + roomId + " " + roomName + " " + bootAmt + " " + maxPlayer);
                $scope.tempRoomId = roomId;
                $scope.tempBootAmt = bootAmt;
                $scope.tempRoomName = roomName;
                $scope.tempMaxPlayer = maxPlayer;
                $scope.tempMinAmt = minAllowed;
                $scope.tempMaxAmt = maxAllowed;
                $scope.tempPotLimit = potLimit;
                $scope.tempBlindLimit = blindLimit;
                $scope.tempChaalLimit = chaalLimit;
                myTeenPatti.showPartial(".editroom");
            } else {
                alert("You are not authorized for this page !!");
            }
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.updateRoomConfig = function () {
        //console.log("updateRoomConfig Got clicked !!");
        if($scope.authToken){
            if($scope.usrRole != 103 && $scope.usrRole != null){
                $.post("updatenewroomconfig",
                    {
                        roomId: $scope.tempRoomId,
                        roomName: $scope.tempRoomName,
                        bootAmount: $scope.tempBootAmt,
                        minAllowed: $scope.tempMinAmt,
                        maxAllowed: $scope.tempMaxAmt,
                        chaalLimit: $scope.tempChaalLimit,
                        potLimit: $scope.tempPotLimit,
                        blindLimit : $scope.tempBlindLimit,
                        maxPlayer: $scope.tempMaxPlayer,
                        authToken: $scope.authToken
                    },
                    function (data, status) {
                        //console.log("Update Rooms: " + JSON.stringify(data) + "\nStatus: " + status);
                        $scope.getAllRooms();

                    });
            } else {
                alert("You are not authorized for this page !!");
            }
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.more = function (playerId, playerName) {
        if($scope.authToken && ($scope.usrRole == 103)){
            $scope.playerId = null;
            myTeenPatti.showPartial(".editplayer");
        } else {
            alert("Please login into system using your credential !!");
        }

    };

    $scope.changePassword = function () {
        //console.log("changePassword Got clicked !!" + $scope.playerId +"   "+ $scope.tempPwd);
        if($scope.authToken){
            if($scope.playerId){
                $.post("resetpassword",
                    {
                        authToken: $scope.authToken,
                        playerToken: $scope.playerId,
                        newPassword: $scope.tempPwd,
                        memberCode: $scope.usrRefId
                    },
                    function (data, status) {
                        console.log("Rooms: " + JSON.stringify(data) + "\nStatus: " + status);
                        if (data.status) {
                            $scope.playerId
                            $scope.getNewPlayer();
                        } else {
                            $scope.playerId
                            alert(data.info);
                        }

                    });
            } else{
                alert("Player Id is mandatory");
            }

        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.updatePlayerCoins = function () {
        //console.log("changePassword Got clicked !!" + $scope.playerId +"   "+ $scope.tempPwd);
        if($scope.authToken && ($scope.usrRole == 103)){
            console.log("Player Id ");
            if(!$('input:radio[name=factor]:checked').val()){
                alert("Coins can either be Added or Subtracted !!");
                return;
            }
            console.log("Radio : " + $('input:radio[name=factor]:checked').val());
            if (isNaN($scope.tempCoin)) {
                alert("Only number are allowed !!");
                return;
            }
            $.post("updateaccount",
                {
                    memberAmount: temp[1],
                    memberTransferType: ($('input:radio[name=factor]:checked').val() == "add") ? "Credit" : "Debit",
                    fundInitiator: $scope.usrRefId,
                    fundReceiver: $scope.playerId,
                    authToken: $scope.authToken
                },
                function (data, status) {
                    console.log("Rooms: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status) {
                        $scope.getPlayerAcc();
                    } else {
                        alert(data.info);
                    }

                }
            );
        } else {
            alert("Please login into system using your credential !!");
        }

    };

    $scope.getAllAgents = function(){
        if($scope.authToken){
            $.post("listagent",
                {
                    authToken: $scope.authToken,
                    memberCode: $scope.usrRefId
                },
                function(data,status){
                    console.log("getAllAgents  ===== > " + JSON.stringify(data));
                    if(data.status){
                        if (data.status && data.agents.length > 0) {
                            console.log(' I am here !!');
                            for (var i = 0; i < data.agents.length; i++) {
                                data.agents[i].id = data.agents[i]._id
                            }
                            console.log(data.agents);
                            myTeenPatti.showPartial(".listagent");
                            $scope.$apply(function () {
                                $scope.agents = data.agents;
                            });
                        } else {
                            alert(data.info);
                        }
                    } else {
                        alert(data.info);
                    }
                });
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.getPlayerAcc = function(){
       if($scope.authToken){
           $.post("getplayerwallet",
               {
                   authToken: $scope.authToken,
                   memberCode: $scope.usrRefId,
                   playerToken: $scope.playerId

               },
               function(data,status){
                    if(data.status){
                        alert("Updated player account balance is : " + data.accBal);
                        $scope.getNewPlayer();
                    } else {
                        alert(data.info);
                    }
               });
       } else {
           alert("Please login into system using your credential !!");
       }
    };

    $scope.getAdminAccDetail = function () {
        if($scope.authToken){
            $.post("getadminacc",
                {
                    authToken: $scope.authToken,
                    memberCode: $scope.usrRefId
                },
                function (data, status) {
                    console.log("Rooms: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status) {
                        $scope.adminAmout = data.accountBal;
                        $("#accbal").text(data.accountBal);
                        $("#adminaccbal").text(data.accountBal);
                        //alert("Mangement Acc balance : " + data.accountBal);
                        console.log("===> " + $scope.adminAmout + " ========= " + data.accountBal);
                        // myTeenPatti.showPartial(".topacc");
                    } else {
                        alert(data.info);
                    }

                });
        } else {
            alert("Please login into system using your credential !!");
        }

    };

    listenCallbacks();

    $scope.fundTransferScr = function(){
        if($scope.authToken){
            if($scope.usrRole != 103){
                myTeenPatti.showPartial(".fundtrfr");
            } else {
                alert("You are not authorized to access this page !!");
            }
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.getMyTransactions = function(){
        if($scope.authToken){
            $.post("getacctransactions",
                {
                    authToken: $scope.authToken,
                    memberCode : $scope.usrRefId
                },
                function(data,status){
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status && data.transactions.length > 0) {
                        for (var i = 0; i < data.transactions.length; i++) {
                            var dt = new Date(data.transactions[i].createdOn);
                            console.log("Date --> "+ dt + "  " + dt.getDate());
                            data.transactions[i].transDate = dt.getDate() + "/" +(dt.getMonth()+1) + "/" + dt.getFullYear();
                            data.transactions[i].id = data.transactions[i]._id;
                        }
                        myTeenPatti.showPartial(".transhist");
                        $scope.$apply(function () {
                            $scope.transactions = data.transactions;
                        });
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });
        } else {

        }
    };

    $scope.agent = function(){
        if($scope.authToken){
            myTeenPatti.showPartial(".creatagent");
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.transferFund = function(){
        if($scope.authToken){
            $.post("fundtransfer",
                {
                    authToken: $scope.authToken,
                    to : $scope.trfAgent,
                    amt : $scope.trfAmount
                },
                function(data,status){
                    if(data.status){
                        alert(data.info);
                        $scope.trfAgent = null;
                        $scope.trfAmount = null;
                    }else {
                        alert(data.info);
                    }
                });
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.createAgent = function(){
        if($scope.authToken){
            if($scope.authToken != null && $scope.agentName !=null && $scope.agentMob != null && $scope.agentPwd != null && $scope.agentComm != null){
                if($scope.agentComm < -1 || $scope.agentComm >= 100){
                    alert("Commission cannot be greater that 100 %");
                    return;
                }
                if(isNaN($scope.agentMob)){
                    alert("Mobile Number cannot be alpha numeric");
                    return;
                }
                /*if(($scope.agentMob).toString().length() > 10){
                    alert("Mobile no cannot be greater than 10 digit");
                    return;
                }*/
                if(($scope.agentName).length > 50){
                    alert("Name cannot be greater than 50 character");
                    return;
                }
                $.post("createagent",
                    {
                        authToken:$scope.authToken,
                        agentName:$scope.agentName,
                        agentMob:$scope.agentMob,
                        agentPwd:$scope.agentPwd,
                        agentComm:$scope.agentComm,
                        agentState:$scope.agentState,
                        agentDist:$scope.agentDist,
                        agentPin:$scope.agentPin,
                        agentAdrs:$scope.agentAdd
                    },
                    function(data,status){
                        if(data.status){
                            alert("ID of newli registered agent is " + data.adminId);
                            $scope.clearAgentForm();
                        }else {
                            alert(data.info);
                        }
                    });
            } else {
                alert("One or more mandatory fields are missing !!");
            }
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.clearAgentForm = function(){
        $scope.agentName = null;
        $scope.agentMob = null;
        $scope.agentPwd = null;
        $scope.agentComm = null;
        $scope.agentState = null;
        $scope.agentDist = null;
        $scope.agentPin = null;
        $scope.agentAdd = null;
    };

    $scope.fundWithdrawal = function(){
        if($scope.authToken && ($scope.usrRole == 103)){
            $scope.trfAmount = null;
            myTeenPatti.showPartial(".fundwdwr");
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.reqWithdrawFund = function(){
        if($scope.authToken && ($scope.usrRole == 103)){
            $.post("withdrawfund",
                {
                    authToken:$scope.authToken,
                    from : $scope.usrRefId,
                    role : $scope.usrRole,
                    amount : $scope.trfAmount
                },
                function(data,status){
                    if(data.status){
                        alert(data.info);
                    } else {
                        alert(data.info);
                    }
                });
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.getWithdrawalHist = function(){
        if($scope.authToken && ($scope.usrRole == 103)){
            $.post("getwithdrawhist",
                {
                    authToken : $scope.authToken,
                    for : $scope.usrRefId
                },
                function(data,status){
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status && data.entries.length > 0) {
                        for (var i = 0; i < data.entries.length; i++) {
                            var dt = new Date(data.entries[i].createdOn);
                            console.log("Date --> "+ dt + "  " + dt.getDate());
                            data.entries[i].withDate = dt.getDate() + "/" +(dt.getMonth()+1) + "/" + dt.getFullYear();
                        }
                        myTeenPatti.showSubPartial(".withhist");
                        $scope.$apply(function () {
                            $scope.withHistories = data.entries;
                        });
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });
        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.getPendingWithdraw = function(){
        if($scope.authToken && ($scope.usrRole == 100)){
            $.post("getpendingwithdrw",
                {
                    authToken : $scope.authToken,
                    for : $scope.usrRefId
                },
                function(data,status){
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    if (data.status && data.entries.length > 0) {
                        for (var i = 0; i < data.entries.length; i++) {
                            var dt = new Date(data.entries[i].createdOn);
                            console.log("Date --> "+ dt + "  " + dt.getDate());
                            data.entries[i].withDate = dt.getDate() + "/" +(dt.getMonth()+1) + "/" + dt.getFullYear();
                        }
                        myTeenPatti.showPartial(".showwtdr");
                        $scope.$apply(function () {
                            $scope.withHistories = data.entries;
                        });
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });

        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.acceptWD = function(withdrawalId){
        if($scope.authToken && ($scope.usrRole == 100)){
            $.post("togglewithdrawstatus",
                {
                    authToken : $scope.authToken,
                    by : $scope.usrRefId,
                    withdrawalId : withdrawalId,
                    status : "ACCEPTED"
                },
                function(data,status){
                    if(data.status){
                        $scope.getPendingWithdraw();
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });

        } else {
            alert("Please login into system using your credential !!");
        }
    };

    $scope.rejectWD = function(withdrawalId){
        if($scope.authToken && ($scope.usrRole == 100)){
            $.post("togglewithdrawstatus",
                {
                    authToken : $scope.authToken,
                    by : $scope.usrRefId,
                    withdrawalId : withdrawalId,
                    status : "REJECTED"
                },
                function(data,status){
                    if(data.status){
                        $scope.getPendingWithdraw();
                    } else {
                        alert(data.info);
                        //myTeenPatti.showPartial(".enabledplayer");
                    }
                });

        } else {
            alert("Please login into system using your credential !!");
        }
    };

/* ------------------------------------Analytics Starts Here -------------------------------*/
    $scope.adminDrop = function(){
        myTeenPatti.showPartial(".adminDrop");
    };

    $scope.agentDrop = function(){
        myTeenPatti.showPartial(".agentDrop");
    };

    $scope.tip = function(){
        myTeenPatti.showPartial(".tip");
        $scope.getGetTipAmountByAdmin();
    };

    $scope.top10Agent = function(){
        myTeenPatti.showPartial(".top10Agent");
    };

    $scope.top20Drop = function(){
        myTeenPatti.showPartial(".top20Drop");
        $scope.getTop20PlayerDropWithAgent();
    };

    $scope.agentDropAgent = function(){
        myTeenPatti.showPartial(".agentDropAgent");
    };

    $scope.agentTransaction = function(){
        myTeenPatti.showPartial(".agentTransaction");
    };

    $scope.agentTopPlayer = function(){
        myTeenPatti.showPartial(".agentTopPlayer");
        $scope.getTop10PlayerDropForAgent();
    };

/* ------------------------------------Analytics Ends Here -------------------------------*/

    $scope.convertMS = function(ms) {
         var d, h, m, s;
         s = Math.floor(ms / 1000);
         m = Math.floor(s / 60);
         s = s % 60;
         h = Math.floor(m / 60);
         m = m % 60;
         d = Math.floor(h / 24);
         h = h % 24;
         return { d: d, h: h, m: m, s: s };
    };

    $scope.doItInMS = function(){
        var dt, h, m, ms;
        dt = new Date();
        h = dt.getHours();
        m = dt.getMinutes();
        m = m + (h*60);
        ms = m * 60 * 1000;
        return  ms;
    };

    $scope.drop = function(){
        var localHM = $scope.doItInMS();
        var currTime = new Date().getTime();
        var diffTime = currTime - localHM;
        $.post("getdrop",
            {
                authToken:$scope.authToken,
                by : $scope.usrRefId,
                role : $scope.usrRole,
                between : {
                    startDate:diffTime,
                    endDate : currTime
                }
            },
            function(data,status){
                if(data.status){
                    console.log("Result from : " + JSON.stringify(data.result))
                } else {
                    alert(data.info);
                }
            });
    }

}]);


//--------------------------------------------------------------------------
//This function validates the date for MM/DD/YYYY format. 
//--------------------------------------------------------------------------
function isValidDate(dateStr) {
 
 // Checks for the following valid date formats:
 // MM/DD/YYYY
 // Also separates date into month, day, and year variables
 var datePat = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
 
 var matchArray = dateStr.match(datePat); // is the format ok?
 if (matchArray == null) {
  alert("Date must be in MM/DD/YYYY format")
  return false;
 }
 
 month = matchArray[1]; // parse date into variables
 day = matchArray[3];
 year = matchArray[4];
 if (month < 1 || month > 12) { // check month range
  alert("Month must be between 1 and 12");
  return false;
 }
 if (day < 1 || day > 31) {
  alert("Day must be between 1 and 31");
  return false;
 }
 if ((month==4 || month==6 || month==9 || month==11) && day==31) {
  alert("Month "+month+" doesn't have 31 days!")
  return false;
 }
 if (month == 2) { // check for february 29th
  var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
  if (day>29 || (day==29 && !isleap)) {
   alert("February " + year + " doesn't have " + day + " days!");
   return false;
    }
 }
 return true;  // date is valid
}

// Format date in MM/DD/YYYY
function formatDate(dateStr){
    var currentDt = new Date(dateStr);
    var mm = currentDt.getMonth() + 1;
        mm = (mm < 10) ? '0' + mm : mm;
    var dd = currentDt.getDate();
    var yyyy = currentDt.getFullYear();
    var date = mm + '/' + dd + '/' + yyyy;
    return date;
}
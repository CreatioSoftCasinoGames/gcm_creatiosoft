

Classified.controller('BundlePaidController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
	 $scope.init = function(){
   		$scope.data = {};
        $scope.data.packType = "paid";
        $scope.appList = [{
        	key: 'Wheel Spins',
        	value: 'wheelSpins'
        },
        {
        	key: 'Keys',
        	value: 'keys'
        },
        {
        	key: 'Scratchers',
        	value: 'scratchers'
        },
        {
            key: 'Power Ups',
            value: 'powerUps'
        },
        {
            key: 'Coins',
            value: 'coins'
        },
        {
            key: 'Tickets',
            value: 'tickets'
        }];

        // $http.get("/bingoAdd/paid")
        // .success(function(res){
        //     if(res.status){
        //         if(res.result){
        //             $scope.data.lobbyAdd.level = res.result.lobbyAdd.level;
        //             $scope.data.dailyBonus.level = res.result.dailyBonus.level;
        //             $scope.data.lobbyAdd.cap = res.result.lobbyAdd.cap;
        //             if(res.result.lobbyAdd.coin){
        //                 $scope.data.lobbyAdd.type = 'coin';
        //                 $scope.data.lobbyAdd.value = res.result.lobbyAdd.coin;
        //             } else if(res.result.lobbyAdd.power){
        //                 $scope.data.lobbyAdd.type = 'power';
        //                 $scope.data.lobbyAdd.value = res.result.lobbyAdd.power;
        //             } else if(res.result.lobbyAdd.ticket){
        //                 $scope.data.lobbyAdd.type = 'ticket';
        //                 $scope.data.lobbyAdd.value = res.result.lobbyAdd.ticket;
        //             }
        //             if(res.result.dailyBonus.coin){
        //                 $scope.data.dailyBonus.type = 'coin';
        //                 $scope.data.dailyBonus.value = res.result.dailyBonus.coin;
        //             } else if(res.result.dailyBonus.power){
        //                 $scope.data.dailyBonus.type = 'power';
        //                 $scope.data.dailyBonus.value = res.result.dailyBonus.power;
        //             } else if(res.result.dailyBonus.ticket){
        //                 $scope.data.dailyBonus.type = 'ticket';
        //                 $scope.data.dailyBonus.value = res.result.dailyBonus.ticket;
        //             }
        //         }
        //     }
        // }).error(function(err){
  
        // });
    }

    $scope.create = function(){
       
        if(!!$scope.data.packType && !!$scope.data.levelStart && !!$scope.data.levelEnd && !!$scope.data.packName && !!$scope.data.originalPrice && !!$scope.data.newPrice && !!$scope.data.skuId && !!$scope.data.dealStartDateTime && !!$scope.data.dealEndDateTime && !!$scope.data.purchaseLimit && !!$scope.data.discountPercent && !!$scope.data.item1 && !!$scope.data.item2 && !!$scope.data.item3 && !!$scope.data.item1value && !!$scope.data.item2value && !!$scope.data.item3value){
            if($scope.data.item1 == $scope.data.item2 || $scope.data.item1 == $scope.data.item3 || $scope.data.item2 == $scope.data.item3){
                alert("Select different values");
            } else{
                console.log($scope.data);
                 var obj = {};
                
                 obj[$scope.data.item1] = $scope.data.item1value;
                 obj[$scope.data.item2] = $scope.data.item2value;
                 obj[$scope.data.item3] = $scope.data.item3value;
                 $scope.data.item1 = undefined;
                 $scope.data.item2 = undefined;
                 $scope.data.item3 = undefined;
                 $scope.data.item1value = undefined;
                 $scope.data.item2value = undefined;
                 $scope.data.item3value = undefined;
                 $scope.data.dealEndDateTime = new Date($scope.data.dealEndDateTime).getTime();
                 $scope.data.dealStartDateTime = new Date($scope.data.dealStartDateTime).getTime();
                 $scope.data.items = obj;
                 $http.post("/iapBundle", $scope.data)
                    .success(function(res){
                        if(res.status){
                            alert("successfully updated");
                            $scope.init();
                        }
                        else
                            alert(res.info);
                    }).error(function(err){
                        alert(err);
                    }); 
                }
            }
            else{
             alert("Insufficient Data !!");
            }
    }

   $scope.init();

}]);
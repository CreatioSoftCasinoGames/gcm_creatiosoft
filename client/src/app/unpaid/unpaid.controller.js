Classified.controller('UnpaidController', ['$scope', '$http','$rootScope',  function($scope, $http,$rootScope) {
   
   $scope.init = function(){
   		$scope.data = {};
        $scope.data.lobbyAdd = {};
        $scope.data.dailyBonus = {};
        $scope.appList = [{
        	key: 'Ticket',
        	value: 'ticket'
        },
        {
        	key: 'Coin',
        	value: 'coin'
        },
        {
        	key: 'Power',
        	value: 'power'
        }];
        $http.get("/bingoAdd/unpaid")
        .success(function(res){
            if(res.status){
            	if(res.result){
                    $scope.data.lobbyAdd.level = res.result.unpaid.lobbyAdd.level;
                    $scope.data.dailyBonus.level = res.result.unpaid.dailyBonus.level;
                    $scope.data.lobbyAdd.cap = res.result.unpaid.lobbyAdd.cap;
                    if(res.result.unpaid.lobbyAdd.coin){
                        $scope.data.lobbyAdd.type = 'coin';
                        $scope.data.lobbyAdd.value = res.result.unpaid.lobbyAdd.coin;
                    } else if(res.result.unpaid.lobbyAdd.power){
                        $scope.data.lobbyAdd.type = 'power';
                        $scope.data.lobbyAdd.value = res.result.unpaid.lobbyAdd.power;
                    } else if(res.result.unpaid.lobbyAdd.ticket){
                        $scope.data.lobbyAdd.type = 'ticket';
                        $scope.data.lobbyAdd.value = res.result.unpaid.lobbyAdd.ticket;
                    }
                    if(res.result.unpaid.dailyBonus.coin){
                        $scope.data.dailyBonus.type = 'coin';
                        $scope.data.dailyBonus.value = res.result.unpaid.dailyBonus.coin;
                    } else if(res.result.unpaid.dailyBonus.power){
                        $scope.data.dailyBonus.type = 'power';
                        $scope.data.dailyBonus.value = res.result.unpaid.dailyBonus.power;
                    } else if(res.result.unpaid.dailyBonus.ticket){
                        $scope.data.dailyBonus.type = 'ticket';
                        $scope.data.dailyBonus.value = res.result.unpaid.dailyBonus.ticket;
                    }
            	}
            }
        }).error(function(err){
  
        });
    }

    $scope.create = function(){
        if(!!$scope.data.lobbyAdd.level && !!$scope.data.lobbyAdd.cap && !!$scope.data.lobbyAdd.type && !!$scope.data.lobbyAdd.value && !!$scope.data.dailyBonus.level && !!$scope.data.dailyBonus.type && !!$scope.data.dailyBonus.value){
            var obj1 = {};
             obj1['unpaid'] = $scope.data;
             $http.post("/bingoAdd/unpaid", obj1)
                .success(function(res){
                    alert("successfully updated");
                    $scope.init();
                }).error(function(err){
                    alert(err);
                }); 
            }
            else{
             alert("Insufficient Data !!");
            }
    }
   $scope.init();

}]);
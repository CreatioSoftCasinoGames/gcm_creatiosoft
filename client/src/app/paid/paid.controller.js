

Classified.controller('PaidController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
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

        $http.get("/bingoAdd/paid")
        .success(function(res){
            if(res.status){
                if(res.result){
                    $scope.data.lobbyAdd.level = res.result.paid.lobbyAdd.level;
                    $scope.data.dailyBonus.level = res.result.paid.dailyBonus.level;
                    $scope.data.lobbyAdd.cap = res.result.paid.lobbyAdd.cap;
                    if(res.result.paid.lobbyAdd.coin){
                        $scope.data.lobbyAdd.type = 'coin';
                        $scope.data.lobbyAdd.value = res.result.paid.lobbyAdd.coin;
                    } else if(res.result.paid.lobbyAdd.power){
                        $scope.data.lobbyAdd.type = 'power';
                        $scope.data.lobbyAdd.value = res.result.paid.lobbyAdd.power;
                    } else if(res.result.paid.lobbyAdd.ticket){
                        $scope.data.lobbyAdd.type = 'ticket';
                        $scope.data.lobbyAdd.value = res.result.paid.lobbyAdd.ticket;
                    }
                    if(res.result.paid.dailyBonus.coin){
                        $scope.data.dailyBonus.type = 'coin';
                        $scope.data.dailyBonus.value = res.result.paid.dailyBonus.coin;
                    } else if(res.result.paid.dailyBonus.power){
                        $scope.data.dailyBonus.type = 'power';
                        $scope.data.dailyBonus.value = res.result.paid.dailyBonus.power;
                    } else if(res.result.paid.dailyBonus.ticket){
                        $scope.data.dailyBonus.type = 'ticket';
                        $scope.data.dailyBonus.value = res.result.paid.dailyBonus.ticket;
                    }
                }
            }
        }).error(function(err){
  
        });
    }

    $scope.create = function(){
        if(!!$scope.data.lobbyAdd.level && !!$scope.data.lobbyAdd.cap && !!$scope.data.lobbyAdd.type && !!$scope.data.lobbyAdd.value && !!$scope.data.dailyBonus.level && !!$scope.data.dailyBonus.type && !!$scope.data.dailyBonus.value){
            var obj1 = {};
             obj1['paid'] = $scope.data;
             $http.post("/bingoAdd/paid", obj1)
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
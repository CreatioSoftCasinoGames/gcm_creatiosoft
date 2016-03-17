
// > Description : Init function will initialize the scope variable objects whenever page is loaded or called from another function. Also it display the previously saved data for unpaid user. 

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
                    $scope.data.lobbyAdd.level = res.result.lobbyAdd.level;
                    $scope.data.dailyBonus.level = res.result.dailyBonus.level;
                    $scope.data.lobbyAdd.cap = res.result.lobbyAdd.cap;
                    if(res.result.lobbyAdd.coin){
                        $scope.data.lobbyAdd.type = 'coin';
                        $scope.data.lobbyAdd.value = res.result.lobbyAdd.coin;
                    } else if(res.result.lobbyAdd.power){
                        $scope.data.lobbyAdd.type = 'power';
                        $scope.data.lobbyAdd.value = res.result.lobbyAdd.power;
                    } else if(res.result.lobbyAdd.ticket){
                        $scope.data.lobbyAdd.type = 'ticket';
                        $scope.data.lobbyAdd.value = res.result.lobbyAdd.ticket;
                    }
                    if(res.result.dailyBonus.coin){
                        $scope.data.dailyBonus.type = 'coin';
                        $scope.data.dailyBonus.value = res.result.dailyBonus.coin;
                    } else if(res.result.dailyBonus.power){
                        $scope.data.dailyBonus.type = 'power';
                        $scope.data.dailyBonus.value = res.result.dailyBonus.power;
                    } else if(res.result.dailyBonus.ticket){
                        $scope.data.dailyBonus.type = 'ticket';
                        $scope.data.dailyBonus.value = res.result.dailyBonus.ticket;
                    }
            	}
            }
        }).error(function(err){
  
        });
    }

// > Description : Here Create function received all the details from unpaid user like lobby add and daily bonus details and hit api (/bingoAdd/unpaid) which save the data for the same and then handled the result accordingly .
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
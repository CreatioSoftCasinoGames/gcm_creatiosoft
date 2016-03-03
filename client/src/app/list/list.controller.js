

Classified.controller('ListController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
	 $scope.init = function(){
   		$scope.data = {};
        $scope.list = {};
        $scope.appList = [{
        	key: 'Paid',
        	value: 'paid'
        },
       
        {
            key: 'Unpaid',
            value: 'unpaid'
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

    $scope.getList = function(){
        if(!!$scope.data.items){
            console.log($scope.data.items);


            $http.get("/iapBundle/"+$scope.data.items)
            .success(function(res){
                if(res.status){
                    if(res.result){
                       console.log(res);
                       $scope.list  = res.result;
                    }
                }
            }).error(function(err){
      
            });
        } else {
            alert("Please select an option");
        }
    }

    $scope.formateDate = function(da){
        return (new Date(da));

    }

   $scope.init();

}]);
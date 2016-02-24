Classified.controller('UnpaidController', ['$scope', '$http','$rootScope',  function($scope, $http,$rootScope) {
   
   $scope.init = function(){
   		$scope.data = {};
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
            		$scope.data.level = res.result.level;
                    $scope.data.cap = res.result.caps;
                    if(res.result.coin){
                        $scope.data.type = 'coin';
                        $scope.data.value = res.result.coin;
                    } else if(res.result.power){
                        $scope.data.type = 'power';
                        $scope.data.value = res.result.power;
                    } else if(res.result.ticket){
                        $scope.data.type = 'ticket';
                        $scope.data.value = res.result.ticket;
                    }
            	}
            }
        }).error(function(err){
  
        });
    }

    $scope.create = function(){
    	console.log($scope.data);
    	if(!!$scope.data.level && !!$scope.data.cap && !!$scope.data.type && !!$scope.data.value){

	    	var object = {
	    		"level" : $scope.data.level,
	    		"caps" : $scope.data.cap
	    	}
	    	if($scope.data.type == "coin"){
	    		object["coin"] = $scope.data.value;
	    	}
	    	else if($scope.data.type == "ticket"){
	    		object["ticket"] = $scope.data.value;
	    	}
	    	else if($scope.data.type == "power"){
	    		object["power"] = $scope.data.value;
	    	}

	    	var obj1 = {};
	    	obj1['unpaid'] = object;
	    	$http.post("/bingoAdd/unpaid", obj1)
            .success(function(res){
                alert("successfully updated");
                $scope.data = {};
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
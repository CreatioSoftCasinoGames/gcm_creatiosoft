

Classified.controller('BundleUnpaidController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
	 $scope.init = function(){
   		$scope.data = {};
        $scope.data.packType = "unpaid";
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
                 if($scope.data.levelStart <= $scope.data.levelEnd){
                    if($scope.data.dealStartDateTime < $scope.data.dealEndDateTime){
                     $http.post("/iapBundle", $scope.data)
                        .success(function(res){
                            if(res.status){
                                alert("successfully updated");
                                $scope.init();
                            }
                            else{
                                alert(res.info);
                                $scope.init();
                            }
                                
                        }).error(function(err){
                            console.log(err);
                            alert("Oops Something went wrong !!");
                            $scope.init();
                        }); 
                    }else {
                        alert("Date Start Time should be smaller then Date End Time!!");
                    }
                 } else {
                    alert("Level Start should be smaller or equal to Level End!!");
                 }s
                }
            }
            else{
             alert("Insufficient Data !!");
            }
    }

     $scope.init();


}]);
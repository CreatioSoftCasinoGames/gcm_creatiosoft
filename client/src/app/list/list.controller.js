

Classified.controller('ListController', ['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
	 $scope.init = function(){
   		$scope.data = {};
        $scope.disp = true;
        $scope.list = {};
        $scope.appList = [{
        	key: 'Paid',
        	value: 'paid'
        },
       
        {
            key: 'Unpaid',
            value: 'unpaid'
        }];
        $scope.bundleList = [{
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

    $scope.back = function(){
        $scope.disp = true;
    }

    $scope.getList = function(itemSelect){
        if(!!itemSelect){
            $scope.disp = true;
            $scope.data = {};
            $scope.data.itemSelect = itemSelect;

            $http.get("/iapBundle/"+itemSelect)
            .success(function(res){
                if(res.status){
                    if(res.result){
                       $scope.list  = res.result;
                    }
                }
            }).error(function(err){
                alert(res.info);
            });
        } else {
            alert("Please select an option");
        }
    }

  
    $scope.formateDate = function(da){
        return (new Date(da).toLocaleString());

    }

    $scope.edit = function(localList){
        $scope.disp = false;
        $scope.data.packType = localList.packType;
        $scope.data.levelStart = localList.levelStart;
        $scope.data.levelEnd = localList.levelEnd;
        $scope.data.packName = localList.packName;
        $scope.data.originalPrice = localList.originalPrice;
        $scope.data.newPrice = localList.newPrice;
        $scope.data.skuId = localList.skuId;
        $scope.data.dealStartDateTime = new Date(localList.dealStartDateTime).toLocaleString();
        $scope.data.dealEndDateTime = new Date(localList.dealEndDateTime).toLocaleString();
        $scope.data.purchaseLimit = localList.purchaseLimit;
        $scope.data.discountPercent = localList.discountPercent;
        $scope.data._id = localList._id;

        var itemObject = localList['items'];
        var itemEntry = [];
        for(var index in itemObject) { 
            if(itemObject[index] > 0){
                var localobject = {};
                localobject['key'] = index;
                localobject['value'] = itemObject[index];
                itemEntry.push(localobject);
            }
        }
        $scope.data.item = itemEntry;
    }

    $scope.update = function(bundleId){
        if(!!$scope.data.packType && !!$scope.data.levelStart && !!$scope.data.levelEnd && !!$scope.data.packName && !!$scope.data.originalPrice && !!$scope.data.newPrice && !!$scope.data.skuId && !!$scope.data.dealStartDateTime && !!$scope.data.dealEndDateTime && !!$scope.data.purchaseLimit && !!$scope.data.discountPercent && !!$scope.data.item){
            if($scope.data.item[0].key == $scope.data.item[1].key || $scope.data.item[1].key == $scope.data.item[2].key || $scope.data.item[0].key == $scope.data.item[2].key){
                alert("Select different values");
            } else{
                 var obj = {};
                
                 obj[$scope.data.item[0].key] = $scope.data.item[0].value;
                 obj[$scope.data.item[1].key] = $scope.data.item[1].value;
                 obj[$scope.data.item[2].key] = $scope.data.item[2].value;
                 $scope.data.item = undefined;
                 $scope.data.itemSelect = undefined;
                 $scope.data._id = undefined
                 $scope.data.dealEndDateTime = new Date($scope.data.dealEndDateTime).getTime();
                 $scope.data.dealStartDateTime = new Date($scope.data.dealStartDateTime).getTime();
                 $scope.data.items = obj;
                 if($scope.data.levelStart <= $scope.data.levelEnd){
                    if($scope.data.dealStartDateTime < $scope.data.dealEndDateTime){
                     $http.put("/iapBundle/update/"+bundleId, $scope.data)
                        .success(function(res){
                            if(res.status){
                                alert("successfully updated");
                                $scope.getList($scope.data.packType);
                            }
                            else{
                                $scope.data._id = bundleId;
                                $scope.data.dealEndDateTime = new Date($scope.data.dealEndDateTime).toLocaleString();
                                $scope.data.dealStartDateTime = new Date($scope.data.dealStartDateTime).toLocaleString();                 
                                alert(res.info);
                            }
                       }).error(function(err){
                            console.log(err);
                            alert("Oops Something went wrong !!");
                            $scope.init();
                        }); 
                    }else {
                        $scope.data._id = bundleId;
                        $scope.data.dealEndDateTime = new Date($scope.data.dealEndDateTime).toLocaleString();
                        $scope.data.dealStartDateTime = new Date($scope.data.dealStartDateTime).toLocaleString(); 
                        alert("Date Start Time should be smaller then Date End Time!!");
                     }
                } else {
                    $scope.data._id = bundleId;
                    $scope.data.dealEndDateTime = new Date($scope.data.dealEndDateTime).toLocaleString();
                    $scope.data.dealStartDateTime = new Date($scope.data.dealStartDateTime).toLocaleString(); 
                    alert("Level Start should be smaller or equal to Level End!!");
                }
            }   
        }
        else{
         alert("Insufficient Data !!");
        }
    } 

   $scope.init();

}]);
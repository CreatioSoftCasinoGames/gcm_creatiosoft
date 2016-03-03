var Classified = angular.module('Classified', [
    'angularjs-datetime-picker',
    'ngRoute'
    
]);

Classified.config(['$routeProvider','$locationProvider','$httpProvider', function ($routeProvider, $locationProvider,$httpProvider) {


	$routeProvider
	.when('/paid', {
			templateUrl:'app/paid/paid.html',
			controller: 'PaidController'
	})
    .when('/unpaid',{
    	templateUrl:'app/unpaid/unpaid.html',
      	controller: 'UnpaidController'
    })	
     .when('/list',{
    	templateUrl:'app/list/list.html',
      	controller: 'ListController'
    })
    .when('/bundlePaid',{
    	templateUrl:'app/bundlePaid/bundlePaid.html',
      	controller: 'BundlePaidController'
    })	
    .when('/bundleUnpaid',{
    	templateUrl:'app/bundleUnpaid/bundleUnpaid.html',
      	controller: 'BundleUnpaidController'
    })
	.otherwise({
		redirectTo: '/list',
		
	});
		
}])


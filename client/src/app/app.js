var Classified = angular.module('Classified', [

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
	.otherwise({
		redirectTo: '/paid',
		
	});
		
}])


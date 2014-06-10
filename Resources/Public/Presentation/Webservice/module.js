angular.module('perfectIn.ui.presentation.webservice', []);
angular.module('perfectIn.ui.presentation.webservice').controller('Webservice.RestController', function($scope, $http) {
	$http.get('/webservice/api/rest').success(function(response){
		$scope.webservices = response;
	});
});
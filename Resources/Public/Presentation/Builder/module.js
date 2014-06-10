angular.module('perfectIn.ui.presentation.builder', []);
angular.module('perfectIn.ui.presentation.builder').controller('Builder.ListController', function($scope, $http, $rootScope) {
	function loadPresentations() {
		$http.get('/webservice/ui/presentation').success(function(response){
			$scope.presentations = response;
		});
	}
	loadPresentations();
	
	$scope.select = function(name) {
		$rootScope.$broadcast('presentationSelected', name);
	};
	$rootScope.$on('presentationCreated', function() {
		loadPresentations();
	});
});
angular.module('perfectIn.ui.presentation.builder').controller('Builder.AdminController', function($scope, $http, $rootScope) {
	$scope.currentPresentation = null;

	$rootScope.$on('presentationSelected', function(event, name) {
		$scope.currentPresentation = name;
	});
});
angular.module('perfectIn.ui.presentation.builder').controller('Builder.CreateController', function($scope, $http, $rootScope) {
	$scope.presentation = null;

	$scope.create = function(presentation) {
		$http.post('/webservice/ui/presentation', presentation).success(function(response){
			$rootScope.$broadcast('presentationCreated', response);
			$scope.presentation = null;
		});
	};
});
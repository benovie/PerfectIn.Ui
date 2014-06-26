angular.module('perfectIn.ui.presentation.builder', []);
angular.module('perfectIn.ui.presentation.builder').controller('Builder.ListController', function($scope, $http, $rootScope) {
	$scope.selected = null;
	$scope.$watch('selected', function(presentation){
		if (presentation) {
			$rootScope.$broadcast('presentationSelected', presentation);
		}
	});	
	
	function loadPresentations() {
		$http.get('/webservice/ui/presentation').success(function(response){
			$scope.presentations = response;
		});
	}
	loadPresentations();
	$rootScope.$on('presentationCreated', function() {
		loadPresentations();
	});
});
angular.module('perfectIn.ui.presentation.builder').controller('Builder.AdminController', function($scope, $http, $rootScope, $builder) {

	$scope.newPresentation = null;
	$scope.currentPresentation = null;
	$scope.showCreateNew = false;

	function loadPresentations() {
		$http.get('/webservice/ui/presentation').success(function(response){
			$scope.presentations = response;
		});
	}
	loadPresentations();
	$scope.$watch('currentPresentation', function(presentation){
		if (presentation) {
			var form = $builder.forms['default'];
			var formConfiguration = presentation.configuration ? presentation.configuration : [];
			console.log(formConfiguration);
			angular.forEach(form, function(formObject, index) {
				$builder.removeFormObject('default',formObject.index);
			});
			
			angular.forEach(formConfiguration, function(formConfigurationObject, index){
				$builder.insertFormObject('default',index,formConfigurationObject);
			});
		}
	});	
	$scope.create = function(request) {
		$http.post('/webservice/ui/presentation', request).success(function(response){
			$rootScope.$broadcast('presentationCreated', response);
			$scope.newPresentation = null;
		});
	};
	$scope.save = function() {
		var request = {
			identifier: $scope.currentPresentation.identifier,
			configuration: $builder.forms['default']
		};
		$http.put('/webservice/ui/presentation', request).success(function(response){
			$rootScope.$broadcast('presentationUpdated', response);
		});
	};

});
angular.module('perfectIn.ui',['builder','builder.components'])
	.service('$presentation', function($http, $q, $timeout) {
	var loaded = {};
	var loading = {};
	
	function get(name) {
		return $http.get('/webservice/ui/presentation/'+name);
	}
	
	function getAll() {
		return $http.get('/webservice/ui/presentation/');
	}
	
	function isLoaded(name) {
		return loaded[name] ? true : false;
	}
	function isLoading(name) {
		return loading[name] ? true : false;
	}
	
	function load(name) {
		var deferred = $q.defer();		
		if (!isLoading(name)) {
			loading[name] = true;
			if (isLoaded(name)) {
				deferred.resolve(loaded[name]);
			} else {
				loadPresentation(name).then(function(presentation){
					loaded[name] = presentation;
					deferred.resolve(loaded[name]);			
				},function(err) {
					deferred.reject(err);
				});
			}
		}
		return deferred.promise;	
	};
	
	function loadPresentation(name) {
		var deferred = $q.defer();

		get(name).success(function(presentation){	
			loadScripts(presentation, function() {
				$timeout(function(){scriptsLoaded(deferred, presentation)},50);
			});
		}).error(function(err) {
			deferred.reject(err);
		});	
		return deferred.promise;
	};
	
	var scriptsToLoad = {};
	var presentations = {};
	function loadScripts(presentation, callback) {		
		var scripts = [];
		for (var id in presentation.scripts) {		
			scripts.push(presentation.scripts[id]);		
			if (!scriptsToLoad[presentation.scripts[id]]) {
				scriptsToLoad[presentation.scripts[id]] = [];
			};
			scriptsToLoad[presentation.scripts[id]].push(presentation.name);
		};
		var amountOfScriptsToLoad = scripts.length;
		if (amountOfScriptsToLoad == 0) {
			callback();
		} else {
			presentations[presentation.name] = {callback: callback, loaded: 0, toload : amountOfScriptsToLoad};		
			angular.forEach(scripts, function(script) {
				$script(script, function() {
					angular.forEach(scriptsToLoad[script], function(presentationNameDependendOnThisScript){
						var dependendPresentation = presentations[presentationNameDependendOnThisScript];
							dependendPresentation.loaded++;
						if (dependendPresentation.toload == dependendPresentation.loaded) {
							dependendPresentation.callback();
						}
					});
				});
			});
		}
	};
	
	function scriptsLoaded(deferred, presentation) {
		if (presentation.modules) {
			angular.require(presentation.modules);
		}
		$http.get(presentation.template).success(function(html){
			presentation.html = html;
			deferred.resolve(presentation);
		}).error(function(err) {
			deferred.reject(err);
		});
	}
	
	return {
		load : function(name) {
			return load(name);
		},
		get : function(name) {
			return get(name);
		},
		getAll : function() {
			return getAll();
		}
	}
})
.directive('piPresentation', ['$compile','$builder','$presentation', function($compile, $builder, $presentation) {
	return function(scope, element, attrs, controller) {
		$presentation.load(attrs.piPresentation).then(function(presentation) {
			element.html(presentation.html);
			scope.presentation = presentation;
			$builder.forms['presentation'] = presentation.configuration;
            $compile(element.contents())(scope);
		}, function(error) {
			element.html('UnknownError');
		});	
	}
}]);
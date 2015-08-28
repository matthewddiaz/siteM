//This is in AngularJS
(function(){

	var app = angular.module('siteM',['ngRoute', 'ui.bootstrap',
													 'siteM.homeController', 'siteM.projectsController']);//ui.router is a dependency that this app is using, look up on github.

	/*the app.config allows angular to state which html page should be injected to the index.html when the client types
	  localhost:3000/ followed by one of the routes below. This allows for Single Page Applications injections to be easily done
	*/
	app.config(['$routeProvider', function($routeProvider){

		$routeProvider//Are the specific routes that user types in the browser will inject the specifc html to index.html
			.when('/home', {
				templateUrl : 'home.html' //what the name of the file that is being injected to index.html
			})
			.when('/projects', {
				templateUrl : 'projects.html'
			})
			.when('/login', {
				templateUrl : 'login.html'
			})
			.when('/admin', {
				templateUrl : 'admin.html'
			})
			.when('/projectTemplate', {
				templateUrl : 'projectTemplate.html'
			})
			.otherwise({
				redirectTo: '/home'
			});
	}]);

	function toggleLinkActiveClass(){
		$('.navigation-bar a').click(function(event){
			 $('a').removeClass('active');
			 $(this).addClass('active');
		 });
	}

	toggleLinkActiveClass();

	app.service('projectDescription', function($rootScope, $q){
		var data = {deferred: null, params: null};
		return({
			open: open,
			params: params,
			proceedTo: proceedTo,
			reject: reject,
			resolve: resolve
		});

		function open(type, params, pipeResponse){
			var previousDeferred = data.deferred;

			data.deferred = $q.defer();
			data.params = params;

			if(previousDeferred && pipeResponse){
				data.deferred.promise
					.then(previousDeferred.resolve, previousDeferred.reject);
			} else if(previousDeferred) {
				previousDeferred.reject();
			}

			$rootScope.$emit('projectDescription.open', type);
			return data.deferred.promise;
		}

		function params() {return data.params || {}; }

		function proceedTo(type, params) {return open(type, params, true);}

		function reject(reason){
			if(!data.deferred) return;

			data.deferred.reject(reason);
			data.deferred = data.params = null;
			$rootScope.$emit('projectDescription.close');
		}

		function resolve(response){
			if(!data.deferred) return;

			data.deferred.resolve(response);
			data.deferred = data.params = null;
			$rootScope.$emit('projectDescription.close');
		}
	});

	app.directive('projectPopUp', function($rootScope, projectDescription){
		this.popup;
		var directive = this;

		return{
			templateUrl: 'projectTemplate.html',
			link: link
		};

		function link(scope, element, attributes){
			scope.popup = null;

			element.on(
				"click",
				function(event){
					if(element[0].firstElementChild !== event.target) return;
					scope.$apply(projectDescription.reject);
				}
			);

			$rootScope.$on(
				'projectDescription.open',
				function(event, modal) { directive.popup = modal;}
			);

			$rootScope.$on(
				'projectDescription.close',
				function(event, modal) { directive.popup = null;}
			);
		}
	});

})();

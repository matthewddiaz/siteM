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
})();

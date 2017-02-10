//Intializing Angular module siteM
(function(){
  /* Following angular-seed on Github to seperate each indiviual angular controller
	*  into there on file for better encapsulation and to prevent monolithic app.js
	*/
	var app = angular.module('siteM', ['ngFileUpload', 'ngRoute', 'ui.bootstrap',
													 'siteM.adminController', 'siteM.coursesController',
													 'siteM.footerController','siteM.loginController',
													 'siteM.homeController', 'siteM.navigationController',
													 'siteM.projectsController', 'siteM.projectsPopUpController'
												 ]);

	/*the app.config allows angular to state which html page should be injected to
	* the index.html when the client types localhost:3000/ followed by one of the
	* routes below. This allows for Single Page Applications injections to be easily done
	*/
	app.config(['$routeProvider', function($routeProvider, $location){
		//this function is used in the resolve for route '/admin' this route should
		//redirect a user to home if he/she has not entered the correct credentials
		 var checkLoggedin = function(Auth, $q, $location){
			var defer = $q.defer();
			if(Auth.isLoggedIn()){
				defer.resolve();
			}else{
				defer.reject();
				$location.url('/home');
			}
			return defer.promise;
		};

		$routeProvider//Are the specific routes that user types in the browser will inject the specifc html to index.html
			.when('/admin', {
				templateUrl : 'admin.html',
				resolve: {
                    loggedIn: checkLoggedin
                }
			})
			.when('/courses', {
				templateUrl : 'courses.html'
			})
			.when('/login', {
				templateUrl : 'login.html'
			})
			.when('/home', {
				templateUrl : 'home.html' //what the name of the file that is being injected to index.html
			})
			.when('/projects', {
				templateUrl : 'projects.html'
			})
			.otherwise({
				redirectTo: '/home'
			});
	}]);

	 app.service('Auth', function(){
		 var token;
		 return {
			 authenticate : function(userToken){
				 token = userToken;
			 },
			 isLoggedIn : function(){
				 return (token) ? true : false;
			 }
		 }
	 });

	/**
	 * service, used to produce modal on projects.html
	 * @param  {name} 'projectDescription'  == name of the serivce
	 * @param  {function} callback function with parameters $rootScope and $q
	 * @return {object}  will contain information for the modal
	 *         {
	 *					 open: open,
	 *					 params: params,
	 *					 proceedTo: proceedTo,
	 *					 reject: reject,
	 * 					 resolve: resolve
 	 *				 }
	 */
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

	/**
	 * directive for projectTemplate.html modal. Used in projects.html
	 * @param  {name} 'projectPopUp' == name of the directive
	 * @param  {function} callback function with parameters $rootScope and $q
	 * @return {object}   The returned object contains the following properties
	 *         {
	 *         	templateUrl : 'html template of the modal',
	 *         	link : sets scope.popup from null to modal on projectDescription.open
	 *         	NOTE in projects.html ng-switch is attached to scope.popup and in
	 *         			 projectTemplate.html ng-show is attached to scope.popup.
	 *         			 That means in projects.html a swap of the DOM structure
	 *         			 ocurrs when scope.popup is true. Finally ng-show in
	 *         			 projectTemplate.html will also display the content only when
	 *         			 scope.popup is true.
	 *         }
	 */
	app.directive('projectPopUp', function($rootScope, projectDescription){
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
				function(event, modal) { scope.popup = modal;}
			);

			$rootScope.$on(
				'projectDescription.close',
				function(event, modal) { scope.popup = null;}
			);
		}
	});

})();

//This is in AngularJS
(function(){

	var app = angular.module("siteM",['ui.router']);//ui.router is a dependency that this app is using, look up on github.

	/*the app.config allows angular to state which html page should be injected to the index.html when the client types
	  localhost:3000/ followed by one of the routes below. This allows for Single Page Applications injections to be easily done
	*/
	app.config(function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise('/home');//otherwise means if a specific url is not given go to this one!

		$stateProvider//Are the specific routes that user types in the browser will inject the specifc html to index.html
			.state('home',{
				'url': '/home', //what the user types in the browser
				'templateUrl' : 'home.html' //what the name of the file that is being injected to index.html
			})
			.state('about',{
				'url' : '/about',
				'templateUrl' : 'about.html'
			});
	});

	/*creating a controller that will handle the login process.
	  For login pages you need a form. For the form you funtion that will be used for ng-submit in the login.html
	*/
	app.controller('loginController',['$state',function($state){
		this.submit = function(){
				$state.go('home');
		};
	}]);


	/*Part 1: Creating a comment box where the user can type and submit a comment which will be displayed below as
	  disabled text boxes. THis comment will be saved into  Cloudant nosql database called blog-db

	  Contains a variables: a string comment variable
	*/
	app.controller('commentController',['$http',function($http){
		this.comment = '';
		this.history = [];
		var controller = this;/*this variable is created to specify the this of the controller and not the this inside
		of a function inside the controller like sendComment*/

		$http.get('/data/history').
  		success(function(data, status, headers, config) {
    		console.log('The blogs are ' + JSON.stringify(data) );

    		/* The http response is an array that contains information from Cloudant blog_db. Data is sorted from
				 *	most recent to oldest comment. A positive outcome will push the element to the front of the array.
				 */
    		data.sort(function(blog_1, blog_2){
    			return blog_2.time - blog_1.time;
    		} );

    		controller.history = data;
  		}).
  		error(function(data, status, headers, config) {
    		console.log('The error is ' + status);
  		});

		this.sendComment = function(){//This is the function that runs when the user press the submit button attached to ng-sumbit in home.html
			console.log("In sendComment");

			/* Will send a http post request (aka send data) to the route /data/arr (aka the backend). Will post the comment and the number of
			 * milliseconds since 1970 to calculate the current time.
			 * a http request have to be in JSON format! Using restful api principles the backend will
			 * store the JSON into the cloudant database.
			 */
			var time_sent = Date.now();
			console.log('The time is ' + JSON.stringify(time_sent) );
			var blog_comment = {
				comment : controller.comment,
				time_posted : time_sent
			}

			$http.post('/data/comment', blog_comment ).
				success(function(data,status,headers, config){

				}).
				error(function(data, status, headers, config){
					console.log('Could not post to ');
			});

			controller.comment = '';//when the comment is saved. The textbox is reset to empty.
		};
	}]);


})();

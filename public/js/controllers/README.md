Controller Notes:
1) Each controller .js file is attached to a .html file.

2) Creating a controller. Each controller needs to be attached to the same
   module that was created in app.js. Once that is completed then attach the
   controller; where the first parameter is the name of the controller and the
   send parameter is callback function which has a parameter of all the services
   and directives that the controller will use.     
   ex:
   angular.module('siteM.gamesController', ['ngRoute'] )
    .controller('GamesController', ['$scope', function($scope){

      }]);

3) To attach a controller to an html file just include the ng-controller directives
    ex: if my controller is the one above then to attach GamesController to Games.html
    do the following: <div ng-controller="GamesController"> </div>

4) To declare a variable inside that controller use
   angular $scope service followed by the the name of that variable.
   ex: $scope.firstName = "Matthew";

5) To display controller variables to the html file use wrap the variable with {{}}
   This will create double binding on that variable.

6) For user input to have their input also reflect the same variable in the controller
   use the ng-model directive

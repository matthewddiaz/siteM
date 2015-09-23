angular.module('siteM.loginController', ['ngRoute'])
  .controller('LoginController',['$scope', '$location', function($scope, $location){
    $scope.email = "";
    $scope.password = "";

    /**
     * [checkIfAdmin function is executed on form submission for login.html ]
     * Only goes to the path /admin if the email and password matches the values
     * below.
     * @return {none}
     */
    this.checkIfAdmin = function(){
      if($scope.email === 'matthewdiaz10@yahoo.com' && $scope.password === 'david10'){
          $location.path('/admin')
         console.log('Hi master');
      }else{
        console.log('That is not the password!');
      }
    };
  }]);

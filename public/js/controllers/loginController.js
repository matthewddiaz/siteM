angular.module('siteM.loginController', ['ngRoute'])
  .controller('LoginController',['$scope', '$location', '$http', 'Auth', function($scope, $location, $http, Auth){
    $scope.formProperties = {
      email : "",
      password : ""
    }

    var originalForm = angular.copy($scope.formProperties);

    /**
     * [checkIfAdmin function is executed on form submission for login.html ]
     * Only goes to the path /admin if the email and password are valid
     * @return {none}
     */
    this.checkIfAdmin = function(){
      var loginInput = {
        email : $scope.formProperties.email,
        password : $scope.formProperties.password
      }
      $http({
        method: 'POST',
        url: 'data/login',
        data: loginInput,
      }).then(function successCallback(response) {
        Auth.authenticate(response.data);

        if(Auth.isLoggedIn()){
          $location.url('/admin');
        }else{
          toastr.error('Incorrect Password', 'Error!');
          //NOTE: loginForm is the name of the form in login.html
          $scope.loginForm.$setPristine();
          //the form will also reset to pristine value
          $scope.formProperties = angular.copy(originalForm);
        }
      }, function errorCallback(response) {
         console.log(response);
      });
    };
  }]);

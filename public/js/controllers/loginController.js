angular.module('siteM.loginController', ['ngRoute'])
  .controller('LoginController',['$location', function($location){
    this.email;
    this.password;
    var controller = this;

    this.checkIfAdmin = function(){
      if(controller.email === 'matthewdiaz10@yahoo.com' && controller.password === 'david10'){
          $location.path('/admin')
         console.log('Hi master');
      }else{
        console.log('That is not the password!');
      }
    };
  }]);

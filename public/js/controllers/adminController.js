angular.module('siteM.adminController', [ 'ngRoute'])
  .controller('AdminController', ['$scope', '$http', function($scope, $http){
    this.projectName;
    this.github;
    this.projectDescription;
    var controller = this;

    this.postProject = function(){
      /*
      var projectInfo = {
          'projectName' : controller.projectName,
          'projectUrl' : controller.github,
          'projectDescription' : controller.projectDescription
      }

      $http.post('/data/upload', projectInfo).
        then(function(response) {
          console.log('The response is ' + response.status);
        }, function(response) {
          console.log(response.error);
        });
      */

      var projectInfo = {
          'projectName' : controller.projectName,
          'projectUrl' : controller.github,
          'projectDescription' : controller.projectDescription
      }

      $http.post('/data/uploadDocs', projectInfo).
        then(function(response) {
          console.log('The response is ' + response.status);
        }, function(response) {
          console.log(response.error);
        });
    };

  }]);

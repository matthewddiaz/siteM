angular.module('siteM.adminController', [ 'ngRoute', 'ngFileUpload'])
  .controller('AdminController', ['$scope', '$http', 'Upload', '$timeout',
              function($scope, $http, Upload, $timeout){
    this.projectName;
    this.github;
    this.projectDescription;
    var controller = this;

    $scope.uploadPic = function(file) {
      var  projectInfo = {
      }
      //console.log(JSON.stringify(file.type));
      Upload.upload({
        url: 'data/uploadDocs',
        method: 'POST',
        fields: {
          "projectName" : controller.projectName,
          "projectUrl" : controller.github,
          "projectDescription" : controller.projectDescription,
          "imageType" : file.type
        }, // Any data needed to be submitted along with the files
        file: file
      });

      /*
      $http.post('/data/uploadDocs', projectInfo).
        then(function(response) {
          console.log('The response is ' + response.status);
        }, function(response) {
          console.log(response.error);
        });*/
    };

    /*
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

    };*/

  }]);

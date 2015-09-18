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
      }).success(function(data, status, headers, config) {
        if(data.ok){
          console.log('The document and attachments were submitted successfully');
        }else{
          console.log('Could not update document and attachment to db do to an error');
        }
      }).error(function(data, status, headers, config) {
      });
    }
  }]);

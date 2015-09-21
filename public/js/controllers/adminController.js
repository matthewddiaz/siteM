angular.module('siteM.adminController', [ 'ngRoute', 'ngFileUpload'])
  .controller('AdminController', ['$scope', '$http', 'Upload', '$timeout',
              function($scope, $http, Upload, $timeout){
    $scope.formProperties = {
      projectName: "",
      github: "",
      projectDescription: "",
      picFile: ""
    }
    var originalForm = angular.copy($scope.formProperties);

    $scope.uploadPic = function(file) {
      var  projectInfo = {
      }
      //console.log(JSON.stringify(file.type));
      Upload.upload({
        url: 'data/uploadDocs',
        method: 'POST',
        fields: {
          "projectName" : $scope.formProperties.projectName,
          "projectUrl" : $scope.formProperties.github,
          "projectDescription" : $scope.formProperties.projectDescription,
          "imageType" : file.type
        }, // Any data needed to be submitted along with the files
        file: file
      }).success(function(data, status, headers, config) {
        if(data.ok){
          toastr.success("Upload Complete", "Success!");
           $scope.adminForm.$setPristine();
           $scope.formProperties = angular.copy(originalForm);
        }else{
          toastr.error('Could not Submit', 'Error!');
        }
      }).error(function(data, status, headers, config) {
      });
    }
  }]);

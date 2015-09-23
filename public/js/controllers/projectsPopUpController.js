angular.module('siteM.projectsPopUpController', ['ngRoute'])
  .controller('ProjectsPopUpController', ['$scope', '$http', 'projectDescription',
    function($scope, $http, projectDescription){
      //passed from showProjectPopUp() in projectsController.js
      $scope.project = projectDescription.params().document || {};
      $scope.cancel =  projectDescription.reject;
  }]);

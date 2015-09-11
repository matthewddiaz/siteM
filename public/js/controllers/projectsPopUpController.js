angular.module('siteM.projectsPopUpController', ['ngRoute'])
  .controller('ProjectsPopUpController', ['$scope', '$http', 'projectDescription',
    function($scope, $http, projectDescription){
      $scope.project = projectDescription.params().document || {};
      $scope.cancel =  projectDescription.reject;
      console.log('The scope.project is ' + JSON.stringify($scope.project) );
  }]);

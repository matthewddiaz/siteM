angular.module('siteM.projectsPopUpController', ['ngRoute'])
  .controller('ProjectsPopUpController', ['$scope', '$http', 'projectDescription',
    function($scope, $http, projectDescription){
      this.title = "Project The first";
      this.description ="This is the first project created by man kind";
  }]);

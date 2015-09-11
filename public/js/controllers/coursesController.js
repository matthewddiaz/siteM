angular.module('siteM.coursesController', ['ngRoute', 'ui.materialize'])
  .controller('CoursesController', ['$http', '$scope', function($http, $scope){

    $http.get('/data/retrieveCourses').
      then(function(response) {
        $scope.semesters = response.data;
        console.log('The scope is ' + JSON.stringify($scope.semesters));
      }, function(response) {
        console.log(response.error);
      });
  }]);

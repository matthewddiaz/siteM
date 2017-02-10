angular.module('siteM.coursesController', ['ngRoute', 'ui.materialize'])
  .controller('CoursesController', ['$http', '$scope', function($http, $scope){

    /**
     * Once all of the date is loaded (from async tasks) we remove the
     * preloader
     * @return {None}
     */

    function displayPreLoader(){
        $('body').removeClass('loaded');
    }
    displayPreLoader();

    function closePreloader(){
      $('body').addClass('loaded');
    }

    /**
     * http get request, gets all of the courses
     * @param  {path} a get request is sent to '/data/retrieveCourses'
     * @return {object}  The response is the object returned from the request
     *                   response.data is an array of JSON objects. Each semester
     *                   object has the following format:
     *                   {
     *                   		"term" : "",
     *                   		courses : [
     *                   			{
     *                   				"name" : "",
     *                   		 		"courseUrl" : "",
     *                   		 		"courseNumber" : ""
     *                   		},....]
     *                   }
     */
    $http.get('/data/retrieveCourses').
      then(function(response) {
        $scope.semesters = response.data;
      }).then(closePreloader)
      .catch(function(error){
        console.log(error);
      });

  }]);

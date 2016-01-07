angular.module('siteM.navigationController', ['ngRoute', 'ui.materialize'])
  .controller('NavigationController',
              ['$scope', '$location',
              function( $scope, $location){

    function addLoaded(){
      $('body').addClass('loaded');
    }

    $scope.loading = function(){
      $('body').removeClass('loaded');
      setTimeout(addLoaded , 500);
    }

    /**
  	 * isActive function that shows which route the user is currently
  	 * on from the possible home, projects, and courses. Adds class
  	 *  'active-page-link' if the route is the same as $location.path()
  	 * @return {none}
  	 */
    $scope.isActive = function(route) { return route === $location.path(); };

  }]);

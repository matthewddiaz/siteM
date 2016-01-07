angular.module('siteM.homeController', ['ngRoute'])
  .controller('HomeController', ['$scope', function($scope){
    $scope.isBio = true;
    /**
     * showBio is executed on hover on ids Tech and Bio in home.html
     * changes the content that is displayed using ng-show/hide
     * from Biography to Technology stack.
     *
     * Note: class 'on' and 'off' only differ in color and opacity. View style.css
     * for more information on these classes
     *
     * @return {none}
     */
    this.showBio = function(){
      console.log($( "#Tech" ).hasClass( "on" ));
      if($( "#Tech" ).hasClass( "on" ) ){
        $( "#Tech" ).removeClass("on").addClass("off");
        $( "#Bio" ).removeClass("off").addClass("on");
        $scope.isBio = !$scope.isBio;
      }
    }

    this.showTech = function(){
      console.log($( "#Bio" ).hasClass( "on" ));
      if($( "#Bio" ).hasClass( "on" ) ){
        $( "#Bio" ).removeClass("on").addClass("off");
        $( "#Tech" ).removeClass("off").addClass("on");
        $scope.isBio = !$scope.isBio;
      }
    }
  }]);

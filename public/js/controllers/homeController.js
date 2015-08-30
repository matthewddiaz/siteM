angular.module('siteM.homeController', ['ngRoute'])
  .controller('HomeController', function(){
    this.isBio = true;
    var controller = this;
    this.showBio = function(){
      console.log($( "#Tech" ).hasClass( "on" ));
      if($( "#Tech" ).hasClass( "on" ) ){
        $( "#Tech" ).removeClass("on").addClass("off");
        $( "#Bio" ).removeClass("off").addClass("on");
        controller.isBio = !controller.isBio;
      }
    }

    this.showTech = function(){
      console.log($( "#Bio" ).hasClass( "on" ));
      if($( "#Bio" ).hasClass( "on" ) ){
        $( "#Bio" ).removeClass("on").addClass("off");
        $( "#Tech" ).removeClass("off").addClass("on");
        controller.isBio = !controller.isBio;
      }
    }
  });

angular.module('siteM.coursesController', ['ngRoute'])
  .controller('CoursesController', function(){
    $(document).ready(function(){
     $('.collapsible').collapsible({
       accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
     });
    });
  });

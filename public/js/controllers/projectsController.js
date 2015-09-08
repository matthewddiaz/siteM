angular.module('siteM.projectsController', ['ngRoute'])
  .controller('ProjectsController',['projectDescription', '$http',
  function(projectDescription, $http){
    this.projectRows = [];
    this.rowLength = 3;
    var controller = this;

    $http.get('/data/retrieveProjectPics').
      then(function(response) {
        console.log('The response data is' + JSON.stringify(response.data));
        var data = response.data;
        for(var i = 0; i < data.length; i = i + controller.rowLength){
          controller.projectRows.push(data.slice(i,i + controller.rowLength));
        }
        console.log(controller.projectRows);

      }, function(response) {
        console.log(response.error);
      });

    this.showProjectPopUp = function(image){
        var promise = projectDescription.open(
          'projectDescription',
          {
            image: image.img,
            docName: image.projectName
          }
        );
        console.log('The image clicked is ' + JSON.stringify(image));
    }
  }]);

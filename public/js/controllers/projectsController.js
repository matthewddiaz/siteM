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
        $http.post('/data/documentWithAttachment', {id:image.projectName}).
          then(function(response) {
            var promise = projectDescription.open(
              'projectDescription',
              { document: response.data }
            );
          }, function(response) {
            console.log(response.error);
        });
    }
  }]);

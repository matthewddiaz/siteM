angular.module('siteM.projectsController', ['ngRoute'])
.controller('ProjectsController',['projectDescription', '$scope', '$http',
function(projectDescription, $scope, $http){
  $scope.projectRows = [];
  $scope.projectsArray = [];
  $scope.rowLength = 3;

  /**
   * [displayProjectFrontImage description]
   * @param  {[type]} projects [description]
   * @return {[type]}          [description]
   */
  function displayProjectFrontImage(projects){
    for(var i = 0; i < projects.length; i = i + $scope.rowLength){
      $scope.projectRows.push(projects.slice(i,i + $scope.rowLength));
    }
  }

  /**
   * [get description]
   * @param  {[type]} '/data/allDocumentsWithAttachments' [description]
   * @return {[type]}                                     [description]
   */
  $http.get('/data/allDocumentsWithAttachments')
  .then(function(projects){
    return $scope.projectsArray = projects.data;
    console.log(projects);
  }).then(displayProjectFrontImage)
  .catch(function(err){
    console.log(err);
  });

  /**
  * showProjectPopUp is executed when user clicks on an image in projects.html
  * Sends a http post request to /data/documentWithAttachment with an object
  * containing the id of that image.
  * NOTE The id is the same as docName for that image's document in cloudant db
  *
  * @param  {number} row is the row of the project that the user clikced
  * @param  {number} col is the col of the project that the user clicked
  * @return {object}  Response.data is the information that was returned
  *                   from the http post request
  *
  * 									showProjectPopUp opens projectDescription service (in app.js)
  * 									and sets document equal to response.data
  */
  this.showProjectPopUp = function(row, col){
    var index = row * $scope.rowLength + col;
    var project = $scope.projectsArray[index];
    projectDescription.open('projectDescription', { document: project });
  }
}]);

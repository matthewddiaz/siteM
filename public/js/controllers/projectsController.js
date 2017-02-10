angular.module('siteM.projectsController', ['ngRoute'])
.controller('ProjectsController',['projectDescription', '$scope', '$http',
function(projectDescription, $scope, $http){
  $scope.projectRows = [];
  $scope.projectsArray = [];
  $scope.rowLength = 3;

  function openPreloader(){
      $('body').removeClass('loaded');
  }

  openPreloader();

  /**
   * This method splits the projectsArray into Rows.
   * Each Row contains three elements.
   * NOTE: this is used to display the UI and have
   * just 3 projects per row.
   * @param  {Array} projects obtained from backend
   * @return {None}
   */
  function displayProjectFrontImage(projects){
    for(var i = 0; i < projects.length; i = i + $scope.rowLength){
      $scope.projectRows.push(projects.slice(i,i + $scope.rowLength));
    }
  }

    /**
   * Once all of the date is loaded (from async tasks) we remove the
   * preloader
   * @return {None}
   */
  function closePreloader(){
    $('body').addClass('loaded');
  }

  /**
   * This method sends a http get request to the route /data/allDoc...
   * NOTE: this method is applying Promise chaining and thus
   * in the first Promise projectsArray is returned and passed to
   * displayProjectFrontImage function
   * @param  {Route} '/data/allDocumentsWithAttachments'
   * @return {None}
   */
  $http.get('/data/allDocumentsWithAttachments')
  .then(function(projects){
    return $scope.projectsArray = projects.data;
  }).then(displayProjectFrontImage)
  .then(closePreloader)
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

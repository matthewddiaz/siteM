angular.module('siteM.projectsController', ['ngRoute'])
  .controller('ProjectsController',['projectDescription', '$scope', '$http',
  function(projectDescription, $scope, $http){
    $scope.projectRows = [];
    $scope.projectsArray = [];
    $scope.rowLength = 3;

    $http.get('/data//allDocumentsWithAttachments')
      .then(function(projects){
        $scope.projectsArray = projects.data;
        console.log($scope.projectsArray);
      }, function(response){
        console.log(response.error);
      });

    /**
     * http request get request to all of the project images and names
     * @param  {path} request is sent to '/data/retrieveProjectPics'
     * @return {object} The response.data contains an array of picture objects
     *         each object has the following property
     *         {
     *         	"img":               ex. "pic1.jpg"
     *         	"projectname" :      ex. "pic 1"
     *         }
     *
     * 	var matt = {
     * 									"name"	: "Matthew",
     * 									"age" : 20,
     * 									"major" : "computer science"
     * 								 }
     *
     *	var students [matt,
     *								{
     *									"name" : "john",
     *									"age" : 25,
     *									"major" : "mechanical"
     *								},
     *								{
     *									"name" : "sarah",
     *									"age" : 18,
     *									"major" : "biology"
     *								}
     *								]
     *
     * 	students.forEach(function(student){
     *  	console.log("Hey my name is: " + student.name );
     *  	console.log("I am " + student.age + " years old");
     *  	console.log("My major is " + student.major);
     * 	});
     */
    $http.get('/data/retrieveProjectPics').
      then(function(response) {
        var data = response.data;
        /* The for loop is dividing the data (projects) into sets  of 3
         * and storing each set in a 2D array called projectRows.
         *
         * Structure of projectRows = [ [{pic object}, {pic object}, {pic object}],
         * 															[{}, {}, {}],
         * 															...
         * 														]
         */
        for(var i = 0; i < data.length; i = i + $scope.rowLength){
          $scope.projectRows.push(data.slice(i,i + $scope.rowLength));
        }
      }, function(response) {
        console.log(response.error);
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

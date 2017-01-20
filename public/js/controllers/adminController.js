angular.module('siteM.adminController', [ 'ngRoute', 'ngFileUpload'])
.controller('AdminController', ['$scope', '$http', 'Upload',
function($scope, $http, Upload){
/**
* [formProperties is a JSON object of all the properties of adminForm.
*  the form is initially in its pristine state]
* @type {Object}
*/
$scope.formProperties = {
  projectName: "",
  github: "",
  projectDescription: "",
  frontDisplayPhoto: "",
  popUpInfoPhoto: ""
}
var originalForm = angular.copy($scope.formProperties);

/**
* [uploadPic] executed on clicking the submit button in admin.html
* @param  {file} the file that the user uploaded. Ex: image, video
* @return {none}
*/
$scope.uploadPic = function(frontPhotoFile, popUpPhotoFile) {
  /**
   * [request object to be sent to the url. Important attributes are
   * fields and file.
   * fields contains document information.
   * file contains an array of files to upload from user
   * NOTE: they must be called fields and file]
   * @type {Object}
   */
  var req = {
    url: 'data/uploadDocs',
    method: 'POST',
    fields: {
      projectName : $scope.formProperties.projectName,
      projectUrl : $scope.formProperties.github,
      projectDescription : $scope.formProperties.projectDescription,
      frontPhotoFileType : frontPhotoFile.type,
      popUpPhotoFile : popUpPhotoFile.type
    },
    file : [frontPhotoFile, popUpPhotoFile]
  }
  console.log(req);

    /**
    * [upload] is a function provided by ng-file-upload module to send a
    * post request contain the project file and attachment.
    * @param  {url} path of the post request
    * @param  {method} request type... ex: Post,Get
    * @param  {object} fields contains both the document and attachment of form
    * @param  {file} file inserted by the user
    * @return {object} The data object proerty ok tells if the submission was successful
    *                  to the database or if an error ocurred.
    */
  Upload.upload(req)
    .success(function(data, status, headers, config) {
      //if submission is success a toast will display the message below.
      if(data.ok){
        toastr.success("Upload Complete", "Success!");
        $scope.adminForm.$setPristine();
        $scope.formProperties = angular.copy(originalForm);//the form will also reset to pristine value
      }else{
        toastr.error('Could not Submit', 'Error!');
      }
    }).error(function(data, status, headers, config) {});
  }
}]);

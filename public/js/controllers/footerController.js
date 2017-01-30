angular.module('siteM.footerController', ['ngRoute'])
.controller('FooterController', ['$http', '$scope', function($http, $scope){
  $scope.lastCommit = '';

  /**
   * This method acquires the last commit date of siteM from UI
   * NOTE: $scope.lastCommit gets displayed in the footer in
   * index.html
   * @param  {Route} '/data/siteMLastCommit'
   * @return {None}
   */
  $http.get('/data/siteMLastCommit')
  .then(function successCallback(response) {
    $scope.lastCommit = response.data;
  }, function errorCallback(error) {
    console.log(error);
  });
}]);

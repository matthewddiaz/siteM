angular.module('siteM.projectsController', ['ngRoute'])
  .controller('ProjectsController', function(){
    this.projectImages = ['calculator.jpg', 'dictionaryApp.jpg',
                          'internetPermission.jpg', 'NameThatCountry.jpg'];
  });

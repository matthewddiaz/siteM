angular.module('siteM.projectsController', ['ngRoute'])
  .controller('ProjectsController',['projectDescription', function(projectDescription){
    this.projectImages = ['calculator.jpg', 'dictionaryApp.jpg',
                          'internetPermission.jpg', 'NameThatCountry.jpg',
                          'great-wave.jpg', 'great-owl.jpg', 'matt.jpg'
                         ];
    this.projectRows = [];
    this.rowLength = 3;

    for(var i = 0; i < this.projectImages.length; i = i + this.rowLength){
      this.projectRows.push(this.projectImages.slice(i,i + this.rowLength));
    }
    console.log(this.projectRows);

    this.showProjectPopUp = function(){
        console.log('I made it to show');
        var promise = projectDescription.open(
          'projectDescription');
    }
  }]);

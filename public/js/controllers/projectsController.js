angular.module('siteM.projectsController', ['ngRoute'])
  .controller('ProjectsController', function(){
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
  });

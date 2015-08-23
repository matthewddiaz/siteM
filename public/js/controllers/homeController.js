angular.module('siteM.homeController', ['ngRoute'])
  .controller('HomeController', function(){
    this.skill = true;
    this.toggleSkill = function(){
      this.skill = !this.skill;
    }
  });

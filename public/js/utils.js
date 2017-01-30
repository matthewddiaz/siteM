function preloader(){
  $(window).load(function(){
    $('body').addClass('loaded');
      console.log("Hi");
  });
}

function loading(){
  $('body').removeClass('loaded');
}

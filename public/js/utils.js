function preloader(){
  $(window).load(function(){
    $('body').addClass('loaded');
  });
}

function loading(){
  $('body').removeClass('loaded');
}

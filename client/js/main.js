jQuery(function($){
  var portfolio = $('#portfolio');
  
  portfolio.masonry({
    isAnimated: true,
    itemSelector: '.bloc:not(.hidden)'
  });

 
	$('a.thumb').on('click', function(e){
 //   var elem = $(this);
    alert("a.thumb")
    e.preventDefault();
  });
});


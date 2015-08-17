jQuery(function($){
  var portfolio = $('#portfolio');
  portfolio.masonry({
    isAnimated: true,
    itemSelector: '.bloc'
  });

	$('h3 a').on('click', function(e){
    var cls = $(this).attr('ng-href').replace('#',''); 
    portfolio.find('.bloc').removeClass('hidden'); 
		portfolio.find('.bloc:not(.'+cls+')').addClass('hidden');
		
    e.preventDefault();
  });
});


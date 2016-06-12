(function($) {

	skel
		.breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#page-wrapper'),
			$banner = $('#banner'),
			$header = $('#header');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Mobile?
			if (skel.vars.mobile)
				$body.addClass('is-mobile');
			else
				skel
					.on('-medium !medium', function() {
						$body.removeClass('is-mobile');
					})
					.on('+medium', function() {
						$body.addClass('is-mobile');
					});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly')
				.scrolly({
					speed: 1500,
					offset: $header.outerHeight()
				});

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight() + 1,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			}

	});

})(jQuery);

//menu reponsive animacion :)

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

onload = function (){
  setTimeout(init,0)
}

init = function(){
  canvas = document.querySelector('canvas')
  ctx = canvas.getContext('2d')

  onresize = function(){
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  onresize()

  mouse = {x:canvas.width/2,y:canvas.height/2,out:false}

  canvas.onmouseout = function(){
    mouse.out = true
  }

  canvas.onmousemove = function(e){
    var rect = canvas.getBoundingClientRect()
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      out: false
    }
  }

  gravityStrength = 10
  particles = []
  spawnTimer = 0
  spawnInterval = 10
  type = 0
  requestAnimationFrame(startLoop)
}

newParticle = function(){
  type = type?0:1
  particles.push({
    x:mouse.x,
    y:mouse.y,
    xv:type?18*Math.random()-9:24*Math.random()-12,
    yv:type?18*Math.random()-9:24*Math.random()-12,
    c:type?'rgb(255,'+((200*Math.random())|0)+','+((80*Math.random())|0)+')':'rgb(255,255,255)',
    s:type?5+10*Math.random():1,
    a:1
  })
}

startLoop = function(newTime){
  time = newTime
  requestAnimationFrame(loop)
}

loop = function(newTime){
  draw()
  calculate(newTime)
  requestAnimationFrame(loop)
}

draw = function(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  for(var i=0;i<particles.length;i++){
    var p = particles[i]
    ctx.globalAlpha = p.a
    ctx.fillStyle = p.c
    ctx.beginPath()
    ctx.arc(p.x,p.y,p.s,0,2*Math.PI)
    ctx.fill()
  }
}

calculate = function(newTime){
  var dt = newTime-time
  time = newTime

  if(!mouse.out){
    spawnTimer += (dt<100)?dt:100
    for(;spawnTimer>0;spawnTimer-=spawnInterval){
      newParticle()
    }
  }

  particleOverflow = particles.length-700
  if(particleOverflow>0){
    particles.splice(0,particleOverflow)
  }

  for(var i=0;i<particles.length;i++){
    var p = particles[i]
    if(!mouse.out){
      x = mouse.x-p.x
      y = mouse.y-p.y
      a = x*x+y*y
      a = a>100?gravityStrength/a:gravityStrength/100
      p.xv = (p.xv+a*x)*0.99
      p.yv = (p.yv+a*y)*0.99
    }
    p.x += p.xv
    p.y += p.yv
    p.a *= 0.99
  }
}

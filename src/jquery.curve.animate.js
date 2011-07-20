///////////////////////////////////////////////////////
// Curve Animate
///////////////////////////////////////////////////////
;(function($) {
	// loop the available curve functions
	$.each($.curve, function(name) {
		var curve = this;
		
		// create a plugin for each curve
		/**
		 * @param opts - options for the curve
		 * @param options - options for the animations
		 */
		$.fn[name] = function(opts, options) {
			
			// tween the element
			return this.tween(function(now, fx) {
				// find the element
				var $elem = $(this);
				
				// execute the curve
				var p = curve(fx.pos, opts);
				var css = {
					left: p[0] + 'px',
					top: p[1] + 'px'
				};
				
				// rotate if it's supported
				if ($.cssHooks.rotate && opts.tangent !== false && $.support.csstransforms) {
					css.rotate = parseFloat(p[2].toFixed(8)) + 'rad';
				}
				
				// change the ship's position	
				$elem.css(css);
			}, options);
		};
	});
})(jQuery);

///////////////////////////////////////////////////////
// Tween
///////////////////////////////////////////////////////
(function($) {
	/**
	 * Run a step function on a jQuery Object
	 * Takes the exact same parameters as animate with
	 *     the exception that a step function is passed instead of a
	 *     list of properties
	 * @param Function fn the step function
	 * @param Number speed
	 * @param String easing
	 * @param Function callback
	 * @see http://api.jquery.com/animate/
	 */
	$.fn.tween = function(fn, speed, easing, callback) {
		// clean up the overloaded options
		var optall = jQuery.speed(speed, easing, callback);
		
		// require that a function is passed
		if ( !$.isFunction( fn ) ) {
			return this.each( optall.complete );
		}

		var p = '_tween';
		return this[ optall.queue === false ? "each" : "queue" ](function() {
			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall );
				
			// force the step to be the passed function
			opt.step = fn;
			
			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};
			opt.animatedProperties[ p ] = opt.easing || 'swing';

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}
			
			// create an fx object
			e = new jQuery.fx( this, opt, p );
			
			// Start the animation
			e.custom( 0, 1, "" );
			
			// For JS strict compliance
			return true;
		});
	}
	
	/**
	 * Override the default step when tweening
	 */
	$.fx.step._tween = $.noop;
})(jQuery);

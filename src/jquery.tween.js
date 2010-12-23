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
		
		// loop each item
		return this[optall.queue === false ? "each" : "queue" ](function() {
			// make a copy of the options
			var opt = jQuery.extend({}, optall);
			
			// force the step to be the passed function
			opt.step = fn;
			
			// force the curAnim to be 'tween'
			opt.curAnim = {'_tween': 1};
			
			// create an fx object
			var fx = new $.fx(this, opt, '_tween');
			
			// Start the animation
			fx.custom(0, 1, '');
			
			// For JS strict compliance
			return true;
		});
	}
	
	/**
	 * Override the default step when tweening
	 */
	$.fx.step._tween = function() {
		// do nothing
	};
})(jQuery);

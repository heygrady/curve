///////////////////////////////////////////////////////
// Curve
///////////////////////////////////////////////////////
(function($) {
	if (typeof $.curve === "undefined") {
		$.curve = {};
	}
	
	/**
	 * Converting a degree to a radian
	 * @const
	 */
	var DEG_RAD = Math.PI/180;
	
	// Curve functions
	$.extend($.curve, {
		/**
		 * Find the slope of a curve at a given time
		 * Uses a secant line to approximate
		 * @param Function fn a curve function
		 * @param Number t time as a percentage of the duration
		 * @param Array opts for the curve function
		 * 
		 * @return Number angle in radians
		 */
		slope: function(fn, t, opts, slope) {
			var h = 1/1000,
				p1 = fn(t+h, opts),
				p2 = fn(t-h, opts);
			
			// calculate slope and direction
			var m = (p1[1]-p2[1])/(p1[0]-p2[0]),
				d = p1[0] < p2[0] ? -1 : 1;
			
			// return teh slope and direction
			if (slope) {
				return [m, d];
			} 
			
			// return the slope angle
			rad = Math.atan(m);
			if (d < 0) {
				rad += Math.PI;
			}
			return rad;
		},
		
		/**
		 * Creates a Bezier Curve
		 * @param Number t time as a percentage of the duration
		 * @param Array opts
		 *      x - offset in pixels
		 *      y - offset in pixels
		 *      points - array of x, y coordinates
		 * @return Array x, y coordinates
		 */
		bezier: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				points: []
			}, opts);

			var n = opts.points.length - 1,
			$b = $.curve.bezier;

			// use the simplified functions when possible
			if (n === 0) {
				return [opts.x, opts.y];
			} else if (n === 1) {
				return $b.linear.apply(this, arguments);
			} else if (n === 2) {
				return $b.quadratic.apply(this, arguments);
			} else if (n === 3) {
				return $b.cubic.apply(this, arguments);
			} else {
				return $b.poly.apply(this, arguments);
			}
		},
		
		/**
		 * Creates a Circle
		 * @param Number t time as a percentage of the duration
		 * @param Array opts
		 *      x - center in pixels
		 *      y - center in pixels
		 *      radius - length of the radius in pixels
		 *      minor - length in pixels of the minor axis
		 *      arc - portion of the circle to draw in degrees
		 *      invert - flips the y-axis
		 * @return Array x, y coordinates
		 */
		circle: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				radius: 0, // required
				arc: 360,
				invert: true
			}, opts);

			t = time(t, opts);

			var i = t * opts.arc,
				alpha = i * DEG_RAD,
				sinalpha = Math.sin(alpha),
				cosalpha = Math.cos(alpha),
				r = opts.radius;

			return [
				opts.x + sinalpha * r,
				opts.y + (opts.invert ? -cosalpha * r : cosalpha * r)
			];
		},
		
		/**
		 * Creates an Ellipse
		 * @param Number t time as a percentage of the duration
		 * @param Array opts
		 *      x - center in pixels
		 *      y - center in pixels
		 *      major - length of the major radius in pixels
		 *      minor - length of the minor radius in pixels
		 *      angle - rotation of the ellipse around the center in degrees
		 *      arc - portion of the ellipse to draw in degrees
		 *      invert - flips the y-axis
		 * @return Array x, y coordinates
		 */
		ellipse: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				major: 0, // required, pixels
				minor: 0, // required, pixels
				angle: 0, // in degrees
				arc: 360,
				invert: true
			}, opts);

			t = time(t, opts);

			var i = t * opts.arc,
				alpha = i * DEG_RAD, // to radians
				sinalpha = Math.sin(alpha),
				cosalpha = Math.cos(alpha),
				a = opts.major,
				b = opts.minor;

			var result = [
				sinalpha * a,
				cosalpha * b
			];
			result = opts.angle ? rotate(result, opts.angle) : result;

			return [
				opts.x + result[0],
				opts.y + (opts.invert ? -result[1] : result[1])
			];
		},
		
		/**
		 * Creates a Sine wave
		 * @param Number t time as a percentage of the duration
		 * @param Array opts
		 *      x - offset in pixels
		 *      y - offset in pixels
		 *      amp - peak deviation from center in pixels
		 *      period - number of complete waves to draw
		 *      rotate - angle to turn the sine wave in degrees, rotate 90 === cosine
		 *      frequency - number of peaks in a single period
		 *      wavelength - width in pixels of a single period
		 *      angle - direction of wave in degrees
		 *      invert - flips the y-axis
		 * @return Array x, y coordinates
		 */
		sine: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				amp: 0, // required, pixels
				period: 1,
				rotate: 0,
				frequency: 1,
				wavelength: 0, // pixels
				angle: 0, // in degrees
				invert: true
			}, opts);

			t = time(t, opts);
			
			var a = opts.amp,
				w = opts.wavelength || a * 2,
				rad = (t * opts.frequency) * opts.period * (360 * DEG_RAD);
			
			// shift the start position
			if (opts.rotate) {
				rad = rad + (opts.rotate * DEG_RAD);
			}
			
			var result = [
				t * opts.period * w,
				parseFloat((Math.sin(rad) * a).toFixed(8))
			];
			result = opts.angle ? rotate(result, opts.angle) : result;
			
			return [
				opts.x + result[0],
				opts.y + (opts.invert ? -result[1] : result[1])
			];
		}
	});

	/**
	 * Creates a Bezier Curve
	 * @param Number t time as a percentage of the duration
	 * @param Array opts
	 *      x - center in pixels
	 *      y - center in pixels
	 *      points - array of x, y coordinates
	 *      angle - direction of wave in degrees
	 * @return Array x, y coordinates
	 */
	$.extend($.curve.bezier, {
		linear: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				points: [],
				angle: 0
			}, opts);

			t = time(t, opts);

			var p = opts.points;
			var result = [
				(1 - t) * p[0][0] + t * p[1][0],
				(1 - t) * p[0][1] + t * p[1][1]
			];
			result = opts.angle ? rotate(result, opts.angle) : result;

			return [
				opts.x + result[0],
				opts.y + result[1]
			];
		},
		
		quadratic: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				points: [],
				angle: 0
			}, opts);

			t = time(t, opts);

			var p = opts.points,
				f = [];
			f[0] = Math.pow(1 - t, 2);
			f[1] = 2 * (1 - t) * t;
			f[2] = Math.pow(t, 2);

			var result = [
				f[0] * p[0][0] + f[1] * p[1][0] + f[2] * p[2][0],
				f[0] * p[0][1] + f[1] * p[1][1] + f[2] * p[2][1]
			];
			result = opts.angle ? rotate(result, opts.angle) : result;

			return [
				opts.x + result[0],
				opts.y + result[1]
			];
		},
		
		cubic: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				points: [],
				angle: 0
			}, opts);

			t = time(t, opts);

			var p = opts.points,
				f = [];
			f[0] = Math.pow(1 - t, 3);
			f[1] = 3 * Math.pow(1 - t, 2) * t;
			f[2] = 3 * (1 - t) * Math.pow(t, 2);
			f[3] = Math.pow(t, 3);

			var result = [
				f[0] * p[0][0] + f[1] * p[1][0] + f[2] * p[2][0] + f[3] * p[3][0],
				f[0] * p[0][1] + f[1] * p[1][1] + f[2] * p[2][1] + f[3] * p[3][1]
			];
			result = opts.angle ? rotate(result, opts.angle) : result;

			return [
				opts.x + result[0],
				opts.y + result[1]
			];
		},
		
		poly: function(t, opts) {
			opts = $.extend({
				x: 0,
				y: 0,
				points: [],
				angle: 0
			}, opts);

			var p = opts.points,
				n = p.length - 1;

			t = time(t, opts);

			var result = [opts.x + 0, opts.y + 0];
			var pN, cN, fN;
			for (var i = 0; i <= n; i++) {
				pN = p[i];
				cN = factorial(n) / (factorial(i) * factorial(n - i));
				fN = cN * Math.pow(1 - t, n - i) * Math.pow(t, i);
				result[0] += fN * pN[0];
				result[1] += fN * pN[1];
			}
			result = opts.angle ? rotate(result, opts.angle) : result;

			return [
				opts.x + result[0],
				opts.y + result[1]
			];
		}
	});
	
	/**
	 * Doctors time based on options
	 * @private
	 * @param Number t time as a percentage of the duration
	 * @param Array opts
	 *      reverse - reverses time to start from the end
	 *      start - time offset
	 *      end - time offset
	 * @return Number
	 */
	function time(t, opts) {
		opts = $.extend({
			reverse: false,
			start: 0,
			end: 1
		}, opts);
		
		t = (t*(opts.end - opts.start)) + opts.start;
		return opts.reverse ? 1-t : t;
	}
	
	/**
	 * Calculates the factorial of a number
	 * @private
	 * @param Number n
	 * @return Number
	 */
	function factorial(n) {
		if ((n === 0) || (n === 1)) {
			return 1;
		} else {
			return (n * factorial(n - 1) );
		}
	}

	/**
	 * Rotates a coordinate around a 0, 0 origin
	 * @private
	 * @param Array p an x, y coordinate
	 * @param Number angle in degrees
	 * @return Array x, y coordinate
	 */
	function rotate(p, angle) {
		var rad = angle * DEG_RAD,
			c = Math.cos(rad),
			s = Math.sin(rad);

		return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
	}
})(jQuery);

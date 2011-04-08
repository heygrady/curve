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
	
	/**
	 * Converting a radian to a degree
	 * @const
	 */
	var RAD_DEG = 180/Math.PI;
	
	// 4 quadrants of a circle
	var QUAD_1 = Math.PI / 2;
	var QUAD_2 = Math.PI;
	var QUAD_3 = Math.PI + QUAD_1;
	var QUAD_4 = Math.PI * 2;
	
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
		slope: function(fn, t, opts) {
			var h = 1/1000,
				p1 = fn(t+h, opts),
				p2 = fn(t-h, opts);
			var rad = Math.atan((p1[1]-p2[1])/(p1[0]-p2[0]));
			if (p1[0] < p2[0]) {
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
		 *      angle - rotation of the circle around the center in degrees
		 *      arc - portion of the circle to draw in degrees
		 *      invert - flips the y-axis
		 * @return Array x, y coordinates
		 */
		circle: function(t, opts) {
			var a = opts.x || 0,
				b = opts.y || 0,
				r = opts.radius || 0,
				angle = opts.angle || 0,
				arc = opts.arc || 360,
				invert = opts.invert || true;
			
			// convert time
			t = time(t, opts);
			
			// calculate current angle
			var alpha = t * arc * DEG_RAD,
				sinalpha = Math.sin(alpha),
				cosalpha = Math.cos(alpha)
			
			// calculate current coords
			var x = a + sinalpha * r,
				y = b + (invert ? -cosalpha * r : cosalpha * r);
			
			// calculate the tangent angle
			var theta = Math.atan(-1 * (x - a)/(y - b));
				
			// rotate the circle
			if (angle !== 0 && angle !== 360) {
				var coord = rotate([x, y], angle);
				x = coord[0];
				y = coord[1];
				theta += angle * DEG_RAD;
			}
			
			// return coords and tangent angle
			return [
				x,
				y,
				theta + (alpha > QUAD_1 && alpha < QUAD_3 ? Math.PI : 0)
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
			var a = opts.x || 0,
				b = opts.y || 0,
				major = opts.major || 0,
				minor = opts.minor || 0,
				angle = opts.angle || 0,
				arc = opts.arc || 360,
				invert = opts.invert || true;
			
			// convert time
			t = time(t, opts);

			// calculate current angle
			var alpha = t * arc * DEG_RAD,
				sinalpha = Math.sin(alpha),
				cosalpha = Math.cos(alpha);

			// calculate coordinates
			var x = a + sinalpha * major,
				y = b + (invert ? -1 : 1) * cosalpha * minor;
			
			// calculate the foci
			var f = Math.sqrt(Math.abs(major*major - minor*minor)),
				f1 = major > minor ? [a + f, b]: [a, b + f],
				f2 = major > minor ? [a - f, b]: [a, b - f];
			
			// calculate the inner angle
			var theta1 = innerAngle([x, y], f1, f2);
			var theta2 = alpha > QUAD_1 && alpha < QUAD_3 ? innerAngle(f1, f2, [x, y]) : innerAngle(f2, f1, [x, y]);
			
			// calculate the tangent angle
			var theta = ((Math.PI - theta1) / 2) - theta2;
			
			// rotate the ellipse
			if (angle !== 0 && angle !== 360) {
				var coord = rotate([x, y], angle);
				x = coord[0];
				y = coord[1];
				theta += angle * DEG_RAD;
			}
			
			// return coords and tangent angle
			return [
				x,
				y,
				theta + (alpha > QUAD_1 && alpha < QUAD_3 ? Math.PI : 0)
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
		 *      frequency - number of peaks in a single period
		 *      wavelength - width in pixels of a single period
		 *      angle - direction of wave in degrees
		 *      arc - portion of the wave to draw in degrees
		 *      invert - flips the y-axis
		 * @return Array x, y coordinates
		 */
		sine: function(t, opts) {
			var a = opts.x || 0,
				b = opts.y || 0,
				A = opts.amp || 0,
				p = opts.period || 1,
				phase = opts.phase || 0,
				f = opts.frequency || 1,
				angle = opts.angle || 0,
				arc = (opts.arc || 360) * DEG_RAD,
				w = opts.wavelength || A * 2,
				invert = opts.invert || true;
			
			// convert time
			t = time(t, opts);
			
			// calculate current angle
			//var alpha = (t * f) * p * (arc * DEG_RAD);
			var alpha = t * f * (arc * p) + phase;

			// calculate coordinates
			var x = a + t * w * arc / Math.PI,
				y = prec(b + Math.sin(alpha) * A, 8);

			// calculate the tangent angle
			// TODO: the alpha needs to be altered based on the wavelength
			var theta = Math.cos(alpha); // not always accurate with a frequency > 1
			//var theta = Math.atan(y / (a + Math.cos(alpha) * w / 2))
			
			console.log(
				prec(theta * RAD_DEG, 2),
				prec(Math.atan(y / (a + Math.cos(alpha) * w / 2)) * RAD_DEG, 2)
			);
			
			// rotate the sine wave
			if (angle !== 0 && angle !== 360) {
				var coord = rotate([x, y], angle);
				x = coord[0];
				y = coord[1];
				theta += angle * DEG_RAD;
			}
			
			// return coords and tangent angle
			return [
				x,
				y,
				theta
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
	 * @param Array p1 the fulcrum
	 * @param Array p2
	 * @param Array p3
	 * @return Float angle in radians
	 */
	function innerAngle(p1, p2, p3) {
		var x1 = p1[0], x2 = p2[0], x3 = p3[0], y1 = p1[1], y2 = p2[1], y3 = p3[1];
		var dx21 = x2-x1,
			dx31 = x3-x1,
			dy21 = y2-y1,
			dy31 = y3-y1,
			m12 = Math.sqrt( dx21*dx21 + dy21*dy21 ),
			m13 = Math.sqrt( dx31*dx31 + dy31*dy31 );
		return Math.acos( (dx21*dx31 + dy21*dy31) / (m12 * m13) );
	}
	
	/**
	 * Doctors time based on options
	 * @private
	 * @param Number t time as a percentage of the duration
	 * @param Object opts
	 *      reverse - reverses time to start from the end
	 *      start - time offset
	 *      end - time offset
	 * @return Number
	 */
	function time(t, opts) {
		var reverse = opts.reverse || false,
			start = opts.start || 0,
			end = opts.end || 1;
		
		// if no alterations
		if (reverse !== true && start === 0 && end === 1) {
			return t;
		}
		
		// otherwise, doctor time
		t = (t * (end - start)) + start;
		return reverse === true ? 1 - t : t;
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
		// skip angles that won't transform
		if (angle === 0 || angle === 360) {
			return p;
		}
		
		// calculate angle
		var rad = angle * DEG_RAD,
			c = Math.cos(rad),
			s = Math.sin(rad);
		
		// transform point
		return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
	}
	
	/**
	 * Trim a number to a decimal prec
	 * @param Float number
	 * @param Number prec decimal places
	 * @return Float
	 */
	function prec(number, precision) {
		var p = Math.abs(parseInt(precision,10)) || 0;
		var coefficient = Math.pow(10, p);
		return Math.round(number*coefficient)/coefficient;
	}
})(jQuery);

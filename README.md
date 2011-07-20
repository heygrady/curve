#Tween
Tween uses the core jQuery animate function to create arbitrary animations beyond animating CSS properties. Instead of taking a list of properties to animate, tween expects a callback function to executed on each step of the animation.

###.tween(step, [duration,] [easing,] [complete])
**step** - A function to be called after each step of the animation.  
**duration** - A string or number determining how long the animation will run.  
**easing** - A string indicating which easing function to use for the transition.  
**complete** - A function to call once the animation is complete.  

###.tween(step, options )
**step** - A function to be called after each step of the animation.  
**options** - A map of additional options to pass to the method. Supported keys:  
*duration:* A string or number determining how long the animation will run.  
*easing:* A string indicating which easing function to use for the transition.  
*complete:* A function to call once the animation is complete.  
*step:* A function to be called after each step of the animation.  
*queue:* A Boolean indicating whether to place the animation in the effects queue. If false, the animation will begin immediately.  
*specialEasing:* A map of one or more of the CSS properties defined by the properties argument and their corresponding easing functions.  

#Curve
Curve defines functions for creating curves as a function of time

###$.curve.circle(t, [options])
**t** - A number representing a percentage of time.  
**options** - A map of additional options to pass to the method. Supported keys:  
*x:* A number, in pixels, the center point of the circle on the x-axis.  
*y:* A number, in pixels, the center point of the circle on the y-axis.  
*radius:* A number, in pixels, the radius of the circle.  
*phase:* A number, in degrees, to shift the angle.  
*angle:* A number, in degrees, to rotate the circle around the center.  
*arc:* A number, in degrees, to determine portion of the circle to draw. Default: 360  
*invert:* A boolean, flips the y-axis.  
*tangent:* A boolean, include the tangent angle.  

###$.curve.ellipse(t, [options])
**t** - A number representing a percentage of time.  
**options** - A map of additional options to pass to the method. Supported keys:  
*x:* A number, in pixels, the center point of the ellipse on the x-axis.  
*y:* A number, in pixels, the center point of the ellipse on the y-axis.  
*major:* A number, in pixels, the major radius of the ellipse.  
*minor:* A number, in pixels, the minor radius of the ellipse.  
*phase:* A number, in degrees, to shift the angle.  
*angle:* A number, in degrees, to rotate the circle around the center.  
*arc:* A number, in degrees, to determine portion of the circle to draw. Default: 360  
*invert:* A boolean, flips the y-axis.  
*tangent:* A boolean, include the tangent angle.  

###$.curve.sine(t, [options])
**t** - A number representing a percentage of time.  
**options** - A map of additional options to pass to the method. Supported keys:  
*x:* A number, in pixels, the start point of the wave on the x-axis.  
*y:* A number, in pixels, the start point of the wave on the y-axis.  
*amp:* A number, in pixels, the peak deviation of the wave.  
*phase:* A number, in degrees, to shift the angle.   
*frequency:* A number of peaks in one period of the wave.  
*angle:* A number, in degrees, to rotate the wave around the start point.  
*arc:* A number, in degrees, to determine portion of the wave to draw. Default: 360  
*invert:* A boolean, flips the y-axis.  
*tangent:* A boolean, include the tangent angle.  

###$.curve.bezier(t, [options])
**t** - A number representing a percentage of time.  
**options** - A map of additional options to pass to the method. Supported keys:  
*x:* A number, in pixels, the start point of the curve on the x-axis.  
*y:* A number, in pixels, the start point of the curve on the y-axis.  
*points:* An array of x and y coordinates for the bezier curve. Minimum 2 points required. 
*angle:* A number, in degrees, to rotate the curve around the start point.   
*invert:* A boolean, flips the y-axis.  
*tangent:* A boolean, include the tangent angle.  
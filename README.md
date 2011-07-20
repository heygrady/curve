#Tween
Tween uses the core jQuery animate function to create arbitrary animations beyond animating CSS properties. Instead of taking a list of properties to animate, tween expects a callback function to executed on each step of the animation.

####.tween(step, [duration,] [easing,] [complete])
**step** - A function to be called after each step of the animation.  
**duration** - A string or number determining how long the animation will run.  
**easing** - A string indicating which easing function to use for the transition.  
**complete** - A function to call once the animation is complete.  

####.tween(step, options )
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

####$.curve.circle(t, [options])
**t** - A float representing a percentage of time.  
**options** - A map of additional options to pass to the method. Supported keys:  
*x:* A number, in pixels, the center point of the circle on the x-axis.  
*y:* A number, in pixels, the center point of the circle on the y-axis.  
*radius:* A number, in pixels, the radius of the circle.  
*phase:* A number, in degrees, to shift the angle.  
*angle:* A number, in degrees, to rotate the circle around the center.  
*arc:* A number, in degrees, to determine portion of the circle to draw.  
*invert:* A boolean, flips the y-axis.  
 AssistiveLightPainting

Using SVG drawings to make light paintings using a custom large RGB light based non-orthongal plotter.

This uses the following technologies:-
 - Raspberry Pi
 - https://www.adafruit.com/product/2348
 - SVG
 - http://anigen.org/versions/0_8_1/
 - https://shop.pimoroni.com/products/mote
 - Out version of vPiP   https://github.com/EduMake/vPiP

### Currently in Development.

## The Proposed Process

- Use inkscape to draw your characters
- Use inkscape to layout your scenes 
- Use Anigen to animate those scenes http://anigen.org/versions/0_8_1/
  - Line colours and widths should be picked up by the lights on the vplotter
- Export the animation as zip file of indvidual frames
- Set up custom large format v-plotter using our parts and the poles from a GREEN screen or other fabric background and control system in dark environment
- Set up camera and software ( https://github.com/EduMake/vPiP )
- The system will then lightpaint each frame as the picture is taken.
- The images are then compiled into a movie file.


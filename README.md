# AssistiveLightPainting

Using SVG drawings to make light paintings using a custom large RGB light based non-orthongal plotter.

## Do you want to make stuff like this ???

[![Lichtfactor - Talk Talk Advert](https://img.youtube.com/vi/QoT53RirX0Y/0.jpg)](https://www.youtube.com/watch?v=QoT53RirX0Y)

## But physically moving a light quickly is difficult for you?

We are building a system to help. It will allow you to animate on your laptop and have a mechansism do the physical drawing.

This uses the following technologies:-
 - Raspberry Pi
 - https://www.adafruit.com/product/2348
 - SVG
 - http://anigen.org/versions/0_8_1/
 - https://shop.pimoroni.com/products/mote
 - Out version of vPiP   https://github.com/EduMake/vPiP


## System Layout

![layout.png](layout.png)

## Our custon vPlotter Mount

![nema14_based_vplotter_mount.png](nema14_based_vplotter_mount.png)


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

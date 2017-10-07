var linearize = require('svg-linearize');
var loadsvg = require('load-svg');
var fs = require('fs');

loadsvg('Fish.svg', function (err, svg) {
    var nsvg = linearize(svg, { tolerance: 3 });
    fs.writeFileSync("Fish2.svg", nsvg)
});
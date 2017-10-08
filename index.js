var fs = require('fs');
var DOMParser = require("domparser");

var svg = require("svg");
//var linearize = require('svg-linearize');




text = fs.readFileSync("Fish.svg", "utf-8");
var elem = svg(text);

console.log(elem);
/*
var loadsvg = require('load-svg');

loadsvg('Fish.svg', function (err, svg) {
    var nsvg = linearize(svg, { tolerance: 3 });
    
    //var nsvg = linearize(elem, { tolerance: 3 });
    fs.writeFileSync("Fish2.svg", nsvg)
});*/
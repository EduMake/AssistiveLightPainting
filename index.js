var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var linearize = require('svg-linearize');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;



var sourceSVG = fs.readFileSync("Fish.svg", "utf-8");


//var svg = require("svg");
//var elem = svg(sourceSVG);

var doc = new JSDOM(sourceSVG);
    
//var doc = new DOMParser().parseFromString(sourceSVG, 'image/svg+xml');
    


//var linearize = require('svg-linearize');

var lsvg = linearize(doc, { tolerance: 3 });


var nsvg = new XMLSerializer().serializeToString(lsvg);
fs.writeFileSync("Fish2.svg", nsvg);

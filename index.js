var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

var doc = new DOMParser().parseFromString(
    '<xml xmlns="a" xmlns:c="./lite">\n'+
        '\t<child>test</child>\n'+
        '\t<child></child>\n'+
        '\t<child/>\n'+
    '</xml>'
    ,'text/xml');
    

var nsvg = XMLSerializer.serializeToString(doc);
fs.writeFileSync("Fish2.svg", nsvg);

//var linearize = require('svg-linearize');



/*
text = fs.readFileSync("Fish.svg", "utf-8");
var elem = svg(text);

console.log(elem);

var loadsvg = require('load-svg');

loadsvg('Fish.svg', function (err, svg) {
    var nsvg = linearize(svg, { tolerance: 3 });
    
    //var nsvg = linearize(elem, { tolerance: 3 });
    fs.writeFileSync("Fish2.svg", nsvg)
});*/
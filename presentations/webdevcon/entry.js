"use strict";
require('./style.scss');
var $ = require('jquery');

var slides = require('./slides.jade');

$('.slides').append(slides);

console.log(slides());

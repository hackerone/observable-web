"use strict";

var $ = require('jquery');

var slides = require('./slides.jade');

$('.slides').append(slides);
$('#what-is-webpack').attr("src", require('file!./what-is-webpack.png'));

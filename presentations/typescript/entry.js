"use strict";

var $ = require('jquery');
require('./main.scss');
var slides = require('./slides.jade');

$('.slides').append(slides);
$('#vscode').attr("src", require('file!./vscode.png'));

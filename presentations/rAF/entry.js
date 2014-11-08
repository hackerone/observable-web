"use strict";

require('./main.scss');

var $ = require('jquery');

var slides = require('./slides.jade');

$('.slides').append(slides);


(function() {
    var _counter = 0;
    var _start = new Date();
    $('#mousemove-counter').mousemove(function() {
        _counter += 1;
        var secs = (new Date() - _start) / 1000;
        if (_counter % 100 === 0) {
            var eps = _counter / secs;
            $('#mousemove-counter').text("Events per Second: " + Math.round(eps));
        }
        if (secs > 2) {
            _counter  = 0;
            _start = new Date();
        }
    });

})();



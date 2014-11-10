"use strict";


var $ = require('jquery');

var slides = require('./slides.jade');

require('./main.scss');

$('.slides').append(slides);


(function() {
    var _counter = 0;
    var _start = new Date();
    $('#mousemove-counter').mousemove(function() {
        _counter += 1;
        var secs = 0;
        if (_counter % 200 === 0) {
            secs = (new Date() - _start) / 1000;
            var eps = _counter / secs;
            $('#mousemove-counter').text("Events per Second: " + Math.round(eps));
        }
        if (secs > 2) {
            _counter  = 0;
            _start = new Date();
        }
    });

})();


function throttle(func, frameRate) {
    var _wait = false;
    return function(e) {
        if (_wait) {
            return;
        }

        _wait = true;
        setTimeout(function() {
            _wait = false;
            func(e);
        }, frameRate);
    };
}


function naiveThrottle(func) {
    var _lastFun = func;
    return function(e) {
        _lastFun = func;
        window.requestAnimationFrame(function() {
            if (_lastFun) {
                _lastFun(e);
                _lastFun = null;
            }
        });
    };
}


var throtteled = naiveThrottle(function(e) {
        console.log(e);
        $('#setTimeout .green').css('left', e.clientX - $("#setTimeout").offset().left);
}, 10);

(function() {
    $('#setTimeout').mousemove(throtteled);
})();

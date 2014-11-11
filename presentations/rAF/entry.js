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

function modifyFactory(selector) {
    return function(e) {
        var offset = $(selector).offset();
        var x = e.clientX - offset.left;
        var y = e.clientY - offset.top;
        var r = Math.sqrt(x);
        $(selector + ' .green')
            .css('left', x)
            .css('top', y)
            .css('width', r)
            .css('height', r);

        $(selector + ' .blue').each(function(i) {
            $(this).css('height', r * (3 + Math.sin(i / 3) * 2))
        })

    }
}


(function() {
    $('#setTimeout').mousemove(throttle(modifyFactory("#setTimeout")));
})();

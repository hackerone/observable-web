"use strict";
require('./css/reveal.css');
require('./scss/default.scss');
require('./lib/css/zenburn.css');

require('script!./lib/js/head.min.js');
require('script!./lib/js/classList.js');
require('script!./lib/js/reveal.min.js');

require('./presentations/' + PRESENTATION + '/entry.js');

window.Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: false,
    theme: window.Reveal.getQueryHash().theme, // available themes are in /css/theme
    transition: 'linear' // default/cube/page/concave/zoom/linear/fade/none
});

require.ensure([], function() {
    require('script!./plugin/highlight/highlight.js');
    window.hljs.initHighlightingOnLoad();
    require('script!./plugin/zoom-js/zoom.js');
});

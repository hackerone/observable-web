// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration

"use strict";
require('./css/reveal.css');
require('./scss/default.scss');

require('script!./lib/js/head.min.js');
require('script!./lib/js/classList.js');
require('script!./js/reveal.js');

window.Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,

    theme: window.Reveal.getQueryHash().theme, // available themes are in /css/theme
    transition: window.Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

    // Optional libraries used to extend on reveal.js
    dependencies: [
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'plugin/highlight/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },
        { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
    ]
});

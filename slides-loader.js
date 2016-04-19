"use strict";
require('./css/reveal.css');
require('./lib/css/monokai.css');

require('script!./lib/js/head.min.js');
require('script!./lib/js/classList.js');
require('script!./lib/js/reveal.min.js');

require('./presentations/' + PRESENTATION + '/entry.js');
require('./plugin/highlight/highlight.js');

window.Reveal.initialize({
    progress: true,
    history: true,
    width: 1600,
    height: 1000,
    center: true,
    slideNumber: true,
    theme: window.Reveal.getQueryHash().theme, // available themes are in /css/theme
    transition: 'dissolve', // default/cube/page/concave/zoom/linear/fade/none
    dependencies: [
        // Cross-browser shim that fully implements classList - https://github.com/eligrey/classList.js/
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },

        // Interpret Markdown in <section> elements
        { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

        // Syntax highlight for <code> elements
        { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },

        // Zoom in and out with Alt+click
        { src: 'plugin/zoom-js/zoom.js', async: true },

        // Speaker notes
        { src: 'plugin/notes/notes.js', async: true }
    ]
});

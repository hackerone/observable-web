"use strict";
var webpack = require('webpack');

module.exports = {
    entry: [
        './slides-loader.js',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ],
    output: {
        path: __dirname + '/js',
        filename: 'slides-loader.js',
        publicPath: '/js/'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        loaders: [
            { test: /\.jade$/, loader: "html!jade-html"},
            { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded&includePaths[]=" + __dirname + '/scss'},
            { test: /\.css$/, loader: "style!css"}
        ],
    },
    // workaround for fs module not available in browser, see https://github.com/webpack/webpack/issues/451
    node: {
      fs: "empty"
    },
    resolve: {
        extensions: ['', '.js', '.jade']
    }
};

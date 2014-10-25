"use strict";
var webpack = require('webpack');

module.exports = {
    entry: [
        './slides.js',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ],
    output: {
        path: __dirname + '/js',
        filename: 'bundle.js',
        publicPath: "/js/"
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        loaders: [
            { test: /\.jade$/, loader: "jade-html"},
            { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded&includePaths[]=" + __dirname + '/scss'},
            { test: /\.css$/, loader: "style!css"}
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jade']
    }
};

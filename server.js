"use strict";
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {
    // webpack-dev-server options
    hot: true,
    contentBase: __dirname,
    quiet: false,
    noInfo: false,
    publicPath: '/js/',
    stats: { colors: true }
});

server.listen(8081, "localhost", function() {});

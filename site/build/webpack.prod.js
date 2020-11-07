'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodConfig = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = prodConfig;
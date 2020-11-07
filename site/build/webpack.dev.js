'use strict';

const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const appDist = path.resolve(__dirname, '../dist');

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: appDist,
        hot: true,
        port: 3000,
        // 服务器启动后打开浏览器
        open: true,
        // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过设置为 true 进行启用
        historyApiFallback: true,
        stats: 'errors-only'
        
    },
    plugins: [
        // 进行模块热替换
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ]
}

module.exports = devConfig;
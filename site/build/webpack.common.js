'use strict';

const path = require('path');
const HappyPack = require('happypack');
const os = require('os')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const isEnvProduction = process.env.NODE_ENV === 'production';
const resolve = dir => path.resolve(__dirname, dir);

const commonConfig = {
  mode: isEnvProduction ? 'production' : 'development',
  entry: resolve('../src/index.js'),
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: resolve('../dist')
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'happypack/loader?id=happyBabel'
      }]
    },{
      test: /\.(png|jpe?g|gif|webp|svg|eot|ttf|woff2?)$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: 'url-loader',
          options: {
            // 大于限制，图片移到目录下  小于限制，使用base64
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'static/asset/[name].[contenthash:8].[ext]'
              }
            }
          }
        }
      ]
    },{
      test: /\.(css|less)$/,
      use: [
        isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',  {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-flexbugs-fixes'
                ], [
                  'postcss-preset-env',
                  {
                    // 添加浏览器前缀
                    autoprefixer: {
                      // https://github.com/umijs/umi/issues/55
                      flexbox: 'no-2009',
                    },
                    // css特性 0实验->4稳定
                    stage: 3
                  },
                ],
              ],
            },
          }
        }, {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#4E9BD4'
              }
            }
          }
        }
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('../public/index.html'),
      favicon: resolve('../public/favicon.ico')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true // 启用缓存
        }
      }],
      // 共享进程池
      threadPool: happyThreadPool
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      "@page": resolve('../src/page'),
      "@component": resolve('../src/component'),
      "@util": resolve('../src/util'),
      "@hooks": resolve('../src/hooks'),
      "@constant": resolve('../src/constant'),
      "@assets": resolve('../src/assets')
    },
    modules: [resolve('../node_modules')]
  }
}

module.exports = () => {
  if (isEnvProduction) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
}
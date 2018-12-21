// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, '');

const webConfig = {
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'siteinspector.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: require.resolve('lodash'),
        use: 'imports-loader?define=>false',
      },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.scss$/,
        include: APP_DIR,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        loader: 'url-loader?limit=100000&name=fonts/[hash].[ext]',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR]),
  ],
};

module.exports = webConfig;

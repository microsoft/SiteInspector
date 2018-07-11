/* eslint-disable import/no-extraneous-dependencies */

import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import common from './webpack.common';

export default merge(common, {
  entry: [
    // must be first entry to properly set public path
    './public/webpack-public-path',
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, 'index.jsx'),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.ejs',
      inject: true,
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

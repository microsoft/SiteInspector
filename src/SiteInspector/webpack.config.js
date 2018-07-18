// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const APP_DIR = path.resolve(__dirname, '');

module.exports = env => (merge(common, {
  entry: `${APP_DIR}/index.jsx`,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_BUILDNUMBER: JSON.stringify(process.env.BUILD_BUILDNUMBER),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        LOCAL_FD: JSON.stringify((env && env.localFD) || 'remote'),
        EDGE_BUILD: (env && env.edgeBuild),
      },
    }),
  ],
}));

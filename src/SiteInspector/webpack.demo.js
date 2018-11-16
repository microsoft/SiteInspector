// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// eslint-disable-next-line import/no-extraneous-dependencies
import merge from 'webpack-merge';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import CopyWebpackPlugin from 'copy-webpack-plugin';
import devConfig from './webpack.dev';

export default merge(devConfig, {
  plugins: [
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../Tabs/dist'), to: 'tabs' }]),
  ],
});

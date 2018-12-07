const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../dist');
const APP_DIR = path.resolve(__dirname, '');

const webConfig = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: 'gettingStartedTab.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
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
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  externals: {
    'site-inspector-actions': 'siteInspector.actions',
    react: 'siteInspector.React',
    redux: 'siteInspector.Redux',
    'prop-types': 'siteInspector.PropTypes',
    'react-redux': 'siteInspector.ReactRedux',
    'site-inspector-ui': 'siteInspector.SiteInspectorUI',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_BUILDNUMBER: JSON.stringify(process.env.BUILD_BUILDNUMBER),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ],
};

module.exports = webConfig;

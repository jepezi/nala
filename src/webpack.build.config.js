var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require("stats-webpack-plugin");
import { jsonloader, imageloader, fontloader, jsloader, cssloaderExtract, cssloaderPrerender } from './webpack.utils';

import { APP_PATH, ENTRY_CLIENT, PUBLIC_DIR } from './constant';

var resolveModules = [
  path.resolve(APP_PATH, 'src'),
  path.resolve(APP_PATH, 'server'),
  'node_modules'
];

var commonloaders = [
  jsloader,
  jsonloader,
  imageloader,
  fontloader
];

// frontendScriptConfig
// for the frontend script tag on prerender.html.
var frontendScriptConfig = {
  entry: {
    main: path.join(APP_PATH, ENTRY_CLIENT),
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux'],
  },
  outputPath: path.join(APP_PATH, 'public', 'dist', 'static')
};

// frontendPrerenderConfig
// for the catch-all express middleware to fetch data and render to string.
// (no css, css is just a map in main.js)
var frontendPrerenderConfig = {
  entry: {
    main: path.join(__dirname, 'renderer', 'prerenderer.js')
  },
  outputPath: path.join(APP_PATH, 'public', 'dist', 'prerenderer')
};

// export webpack config
module.exports = [
{
  // frontend ------------------------------------------------------
  devtool: 'source-map',
  context: APP_PATH,
  entry: frontendScriptConfig.entry,
  output: {
    path: frontendScriptConfig.outputPath,
    filename: '[name].js?[chunkhash]',
    chunkFilename: '[name].clientchunk.js?[chunkhash]',
    publicPath: PUBLIC_DIR
  },
  module: {
    loaders: [].concat(commonloaders, cssloaderExtract)
  },
  resolve: {
    modules: resolveModules
  },
  plugins: [
    new StatsPlugin('../../../webpack-stats.json', {
      // chunkModules: true,
      chunks: false,
      modules: false,
    }),
    // new webpack.optimize.CommonsChunkPlugin("vendor", "[name].js?[chunkhash]"),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].js?[chunkhash]' }),
    new ExtractTextPlugin('[name].css?[contenthash]', {allChunks: true}),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    })
  ]
},
{
  // prerender ------------------------------------------------------
  target: "node",
  devtool: 'source-map',
  context: APP_PATH,
  entry: frontendPrerenderConfig.entry,
  output: {
    path: frontendPrerenderConfig.outputPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: PUBLIC_DIR,
    libraryTarget: 'commonjs2'
  },
  // externals: fs.readdirSync(
  //   path.resolve(__dirname, '..', 'node_modules')
  // ).concat([
  //   'react-dom/server',
  //   'react/dist/react.min',
  //   'lodash',
  // ]).reduce(function (ext, mod) {
  //   console.warn('module: ', mod);
  //   ext[mod] = 'commonjs ' + mod
  //   return ext
  // }, {}),
  externals: [
    /^react(.*)?$/,
    /^history(\/.*)?$/,
    /^lodash(\/.*)?$/,
    "redux",
    "iconv-lite",
    "serialize-javascript",
    "normalizr",
    "redux-logger",
    "isomorphic-fetch"
  ],
  module: {
    exprContextRegExp: /$^/,
    exprContextCritical: false, // ignore expression in require, i.e. isomorphic-fetch
    loaders: [].concat(commonloaders, cssloaderPrerender)
  },
  resolve: {
    modules: resolveModules
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: false,
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
  ]
}
];

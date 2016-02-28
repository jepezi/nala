var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require("stats-webpack-plugin");
var APPPATH = process.cwd();
var publicPath = '/dist/static/';

// --------- loader ---------
var jsonloader = { test: /\.json$/, loader: 'json-loader' };
var imageloader = { test: /\.(jpe?g|png|gif)$/, loader: "file" };
var fontloader = { test: /\.(eot|ttf|wav|mp3|woff)$/, loader: 'file' };
var jsloader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015-native-modules', 'react', 'stage-2'],
    plugins: [
      // 'add-module-exports',
      'transform-runtime',
      'transform-react-constant-elements', // optimize: constant first
      'transform-react-inline-elements' // optimize
    ],
    // plugins: ['transform-runtime']
  }
}
// var jsloader5 = {
//   test: /\.js$/,
//   exclude: /node_modules/,
//   loader: 'babel',
//   query: {
//     presets: ['node5', 'react'],
//     plugins: [
//       'add-module-exports',
//       'transform-runtime',
//       'transform-react-constant-elements', // optimize: constant first
//       'transform-react-inline-elements' // optimize
//     ],
//     // plugins: ['transform-runtime']
//   }
// }
var cssloaderExtract = [
  { test: /\.module.s?css$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2!postcss!sass?outputStyle=expanded&' +
      "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/"))) },
  { test: /^((?!\.module).)*css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?outputStyle=expanded&' +
      "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/"))) },
];
var cssloaderPrerender = [
  { test: /\.module.s?css$/, loader:  'css/locals?modules&importLoaders=2!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/")) },
  { test: /^((?!\.module).)*css$/, loader: 'css/locals!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/")) },
];

var commonloaders = [
  jsloader,
  jsonloader,
  imageloader,
  fontloader
];
// var commonloaders5 = [
//   jsloader5,
//   jsonloader,
//   imageloader,
//   fontloader
// ];

/*
  frontendScriptConfig
  -------------------------------------------------------
  for the frontend script tag on prerender.html.
  - main.js (with chunkhash)
  - vendor.js (with chunkhash)
  - main.css (with contenthash)
 */

var frontendScriptConfig = {
  entry: {
    // main: './src/client/main.js',
    main: path.join(APPPATH, 'src/client/main.js'),
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux'],
  },
  // outputPath: path.join(__dirname, '../public/dist/static')
  outputPath: path.join(APPPATH, 'public', 'dist', 'static')
};

/*
  frontendPrerenderConfig
  -------------------------------------------------------
  for the catch-all express middleware to fetch data and render to string.
  - main.js
  - no css, css is just a map in main.js
 */
var frontendPrerenderConfig = {
  entry: {
    // main: './server/renderer/prerenderer.js'
    main: ['babel-polyfill', path.join(__dirname, 'renderer/prerenderer.js')]
  },
  // outputPath: path.join(__dirname, '../public/dist/prerenderer')
  outputPath: path.join(APPPATH, 'public', 'dist', 'prerenderer')
};

// export webpack config for 3.
module.exports = [
{
  // frontend ------------------------------------------------------
  devtool: 'source-map',
  context: APPPATH,
  entry: frontendScriptConfig.entry,
  output: {
    path: frontendScriptConfig.outputPath,
    filename: '[name].js?[chunkhash]',
    chunkFilename: '[name].clientchunk.js?[chunkhash]',
    publicPath: publicPath
  },
  module: {
    loaders: [].concat(commonloaders, cssloaderExtract)
  },
  resolve: {
    modules: [
      path.resolve(APPPATH, 'src'),
      path.resolve(APPPATH, 'server'),
      'node_modules'
    ]
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
      __DEVTOOLS__: false,
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
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false }
    // })
  ]
},
{
  // prerender ------------------------------------------------------
  target: "node",
  devtool: 'source-map',
  context: APPPATH,
  entry: frontendPrerenderConfig.entry,
  output: {
    path: frontendPrerenderConfig.outputPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: publicPath,
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
    "serialize-javascript"
  ],
  module: {
    exprContextRegExp: /$^/,
    exprContextCritical: false, // ignore expression in require, i.e. isomorphic-fetch
    loaders: [].concat(commonloaders, cssloaderPrerender)
  },
  resolve: {
    modules: [
      path.resolve(APPPATH, 'src'),
      path.resolve(APPPATH, 'server'),
     'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
    }),
    // optimizations
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false }
    // })
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

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
import { APP_PATH } from './constant';

/**
 * [Loader] Common
 *
 */
export const jsonloader = { test: /\.json$/, loader: 'json-loader' };
export const imageloader = { test: /\.(jpe?g|png|gif)$/, loader: "file" };
export const fontloader = { test: /\.(eot|ttf|wav|mp3|woff)$/, loader: 'file' };

/**
 * [Loader] JS
 *
 */

export const jsloader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015-native-modules', 'react', 'stage-2'],
    plugins: [
      'transform-runtime',
      'transform-react-constant-elements', // optimize: constant first
      'transform-react-inline-elements' // optimize
    ]
  }
}

export const jsloaderDev = {
  test: /.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015-native-modules', 'react', 'stage-2'],
    env: {
      development: {
        presets: ['react-hmre']
      }
    }
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

/**
 * [Loader] CSS
 *
 */
export const cssloaderExtract = [
  { test: /\.module.s?css$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2!postcss!sass?outputStyle=expanded&' +
      "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src'))) },
  { test: /^((?!\.module).)*css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?outputStyle=expanded&' +
      "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src'))) },
];

export const cssloaderPrerender = [
  { test: /\.module.s?css$/, loader:  'css/locals?modules&importLoaders=2!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src')) },
  { test: /^((?!\.module).)*css$/, loader: 'css/locals!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src')) },
];

export const cssloaderDev = [
  { test: /\.module.s?css$/, loader:  'style!css?modules&importLoaders=1&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src')) },
  { test: /^((?!\.module).)*css$/, loader: 'style!css!postcss!sass?outputStyle=expanded&sourceMap&' + "includePaths[]=" + encodeURIComponent(path.resolve(APP_PATH, 'src')) },
];

var path = require('path');
var webpack = require('webpack'); // (5)
var APPPATH = process.cwd();

var jsloader = {
  test: /.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015-native-modules', 'react', 'stage-2'],
    // plugins: ['add-module-exports'],
    env: { // (3)
      development: {
        presets: ['react-hmre']
      }
    }
  }
}

var cssloaders = [
  { test: /\.module.s?css$/, loader:  'style!css?modules&importLoaders=1&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?outputStyle=expanded&' + "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/")) },
  { test: /^((?!\.module).)*css$/, loader: 'style!css!postcss!sass?outputStyle=expanded&sourceMap&' + "includePaths[]=" + encodeURIComponent(path.resolve(__dirname, "../src/")) },
];

var jsonloader = { test: /\.json$/, loader: 'json-loader' };

// export webpack config object.
module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {
    main: [ // (1)
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      path.join(APPPATH, 'src/client/main.js')
    ]
  },
  output: {
    path: path.join(APPPATH, 'public', 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: 'http://localhost:3001/dist/',
  },
  module: {
    loaders: [jsloader, jsonloader].concat(cssloaders)
  },
  resolve: {
    modules: [
       path.resolve(APPPATH, 'src'),
       path.resolve(APPPATH, 'server'),
       'node_modules'
    ]
  },
  plugins: [ // (4)
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  postcss: function(webpack) {
    return [
      require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ]
  },
};

var path = require('path');
var webpack = require('webpack');
import { jsonloader, jsloaderDev, cssloaderDev } from './webpack.utils';
import { APP_PATH, ENTRY_CLIENT } from './constant';

// export webpack config object.
module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {
    main: [
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      path.join(APP_PATH, ENTRY_CLIENT)
    ]
  },
  output: {
    path: path.join(APP_PATH, 'public', 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: 'http://localhost:3001/dist/',
  },
  module: {
    loaders: [jsloaderDev, jsonloader].concat(cssloaderDev)
  },
  resolve: {
    modules: [
       path.resolve(APP_PATH, 'src'),
       path.resolve(APP_PATH, 'server'),
       'node_modules'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  postcss: function(webpack) {
    return [
      require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ]
  },
};

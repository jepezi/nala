require('babel-polyfill')

var dotenv = require('dotenv')
dotenv.load({
  path: process.cwd() + '/.env',
  silent: true
})

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__SSR__ = process.env.SSR;

module.exports = require('./lib/PublicAPI')

import path from 'path'

export const APP_PATH = process.cwd()
export const APP_PORT = process.env.PORT || 3000
export const DEV_PORT = process.env.DEV_PORT || 3001
export const CONFIG = require(path.join(APP_PATH, 'config.js'))
export const ENTRY_CLIENT = CONFIG.entry || 'src/main.js';
export const PUBLIC_DIR = CONFIG.public_dir || '/dist/static/';
export const WHITELIST = CONFIG.whitelist || [];

// csp stuffs
const csp = CONFIG.csp || { directives: {} };
let CSPD = csp.directives;
let cspDirectives = {};

if (typeof CSPD.defaultSrc !== 'undefined') {
  cspDirectives.defaultSrc = ["'self'"].concat(CSPD.defaultSrc);
}
if (typeof CSPD.scriptSrc !== 'undefined') {
  cspDirectives.scriptSrc = ["'self'"].concat(CSPD.scriptSrc);
}
if (typeof CSPD.styleSrc !== 'undefined') {
  cspDirectives.styleSrc = ["'self'"].concat(CSPD.styleSrc);
}
if (typeof CSPD.imgSrc !== 'undefined') {
  cspDirectives.imgSrc = ["'self'", 'data:'].concat(CSPD.imgSrc);
}
if (typeof CSPD.connectSrc !== 'undefined') {
  cspDirectives.connectSrc = ["'self'", 'ws:'].concat(CSPD.connectSrc);
}
if (typeof CSPD.fontSrc !== 'undefined') {
  cspDirectives.fontSrc = ["'self'"].concat(CSPD.fontSrc);
}
if (typeof CSPD.objectSrc !== 'undefined') {
  cspDirectives.objectSrc = [].concat(CSPD.objectSrc);
}
if (typeof CSPD.mediaSrc !== 'undefined') {
  cspDirectives.mediaSrc = [].concat(CSPD.mediaSrc);
}
if (typeof CSPD.frameSrc !== 'undefined') {
  cspDirectives.frameSrc = [].concat(CSPD.frameSrc);
}

const cspOptions = { directives: cspDirectives };

cspOptions.disableAndroid = typeof csp.disableAndroid !== 'undefined'
  ? csp.disableAndroid : false;

cspOptions.browserSniff = typeof csp.browserSniff !== 'undefined'
  ? csp.browserSniff : true;

export const CSP_OPTIONS = cspOptions;

import path from 'path'

export const APP_PATH = process.cwd()
export const APP_PORT = process.env.PORT || 3000
export const DEV_PORT = process.env.DEV_PORT || 3001
export const CONFIG = require(path.join(APP_PATH, 'config.js'))
export const ENTRY_CLIENT = CONFIG.entry || 'src/main.js';
export const PUBLIC_DIR = CONFIG.public_dir || '/dist/static/';
export const WHITELIST = CONFIG.whitelist || [];

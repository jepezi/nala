import path from 'path';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import favicon from 'serve-favicon';

//
import { APP_PATH, APP_PORT, DEV_PORT, CSP_OPTIONS } from './constant';

//
const devStat = {
  publicPath: 'http://localhost:' + DEV_PORT + '/dist/',
  assetsByChunkName: {
    main: 'main.js'
  }
};

const RendererClass = __DEVELOPMENT__
  ? require('./renderer/simplerenderer.js')()
  : __SSR__
    ? require(path.join(APP_PATH, 'public/dist/prerenderer/main.js')).default
    : require('./renderer/simplerenderer.js')()

const stat = __DEVELOPMENT__
  ? devStat
  : require(path.join(APP_PATH, 'webpack-stats.json'));

const renderer = new RendererClass({
  cssUrl: stat.publicPath + [].concat(stat.assetsByChunkName.main)[1],
  scriptUrl: stat.publicPath + [].concat(stat.assetsByChunkName.main)[0],
  vendorUrl: stat.publicPath + [].concat(stat.assetsByChunkName.vendor)[0],
});

//
export function createServer() {
  const server = express()

  if (process.env.NODE_ENV === 'production') {
    server.use(compression())
  }

  server.disable('x-powered-by')
  server.use(favicon(path.join(APP_PATH, 'public/favicon.ico')));
  server.use(express.static(path.join(APP_PATH, 'public')))
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'production') {
    // Security settings
    // hpp protects against parameter pollution attacks
    server.use(hpp())
    // Helmet is a suite of security middleware functions to try and protect
    // against common attacks. Get more info from the helmet README
    server.use(helmet.csp(CSP_OPTIONS))
    server.use(helmet.xssFilter())
    server.use(helmet.frameguard('deny'))
    server.use(helmet.ieNoOpen())
    server.use(helmet.noSniff())
  }

  server._listen = server.listen

  server.listen = () => {
    throw new Error('[nala]', 'Do not call `server.listen()`, use `server.start()`')
  }

  server.start = () => {
    server.all('*', (req, res) => {
      renderer.render(req, (err, redirect, html) => {
        if (err) {
          res.statusCode = 500;
          res.type('html');
          res.end(err.message);
          return;
        }
        if (redirect) {
          res.redirect(301, redirect);
          return;
        }

        res.type('html');
        res.end(html);
      });
    })

    server._listen(APP_PORT, () => {
      console.log()
      console.log(`NODE_ENV=${process.env.NODE_ENV}`)
      console.log(`Express server listening on port`, APP_PORT)
    })
  }

  return server
}

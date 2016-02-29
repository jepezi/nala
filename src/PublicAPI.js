import path from 'path';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';

//
const APPPATH = process.cwd();
const PORT = 3000;

//
const devStat = {
  publicPath: 'http://localhost:3001/dist/',
  assetsByChunkName: {
    main: 'main.js'
  }
};

const RendererClass = __DEVELOPMENT__
  ? require('../renderer/simplerenderer.js')('client.html')
  : require(path.join(APPPATH, 'public/dist/prerenderer/main.js')).default;

const stat = __DEVELOPMENT__
  ? devStat
  : require(path.join(APPPATH, 'webpack-stats.json'));

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
  server.use(express.static(path.join(APPPATH, 'public')))
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'production') {
    // Security settings
    // hpp protects against parameter pollution attacks
    server.use(hpp())
    // Helmet is a suite of security middleware functions to try and protect
    // against common attacks. Get more info from the helmet README
    server.use(helmet.csp({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'oss.maxcdn.com'
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'", 'ws:', 'jsonplaceholder.typicode.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"]
      },
      disableAndroid: false
    }))
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

    server._listen(PORT, () => {
      console.log()
      console.log(`NODE_ENV=${process.env.NODE_ENV}`)
      console.log(`Express server listening on port`, PORT)
    })
  }

  return server
}

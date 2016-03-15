import path from 'path';
import { readFileSync } from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
// import React, { renderToString } from 'react/dist/react.min'; // optimize: use minified react
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { RoutingContext, match } from 'react-router';

import configureStore from 'redux/configureStore';

import { CSR_HTMLFILE } from '../constant';

console.warn('from prerender: ',CSR_HTMLFILE);

// import routes from 'client/routes';
/**
In lib/renderer/prerender.js, we have these 2 lines.

var _routes = require('client/routes');
var _routes2 = _interopRequireDefault(_routes);

the first require gives this.

{ default:
   { path: '/',
     component: [Function: App],
     indexRoute: { component: [Object] },
     childRoutes: [ [Object], [Object], [Object] ]
    }
}

then second _interopRequireDefault put that in a nested {default: obj} again
so to use, we need to do ugly double default way.
routes: _routes2.default.default
**/
// FIX: try normal require.
const routes = require('routes');

const markup = readFileSync(
  path.resolve(process.cwd(), 'public', 'prerender.html'),
  'utf-8'
);

class MainRenderer {
  constructor(options) {
    this.html = markup
      .replace('__CSS__', options.cssUrl)
      .replace('__VENDOR__', options.vendorUrl)
      .replace('__SCRIPT__', options.scriptUrl);
  }

  render(req, callback) {
    const store = configureStore();

    match({ routes: routes.default, location: req.url }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        let redirectPath = redirectLocation.pathname + redirectLocation.search;
        if (redirectLocation.state && redirectLocation.state.intend) {
          redirectPath += '?intend=' + redirectLocation.state.intend;
        }
        callback(null, redirectPath, null);
        return;
      }

      if (error) {
        if (error.redirect) {
          callback(null, error.redirect, null);
          return;
        }

        callback({ message: error.stack }, null, null);
        return;
      }

      // prefetch & hydrate store
      const { params, location } = renderProps;

      const prefetchMethods = renderProps.components
        .filter(c => c.fetchData)
        .reduce((acc, c) => acc.concat(c.fetchData), []);

      const promises = prefetchMethods
        .map(prefetch => prefetch(store, params, location));

      // wait for fetched state data in store
      Promise.all(promises)
        .then(() => {
          const __CONTENT__ = renderToString(
            <Provider store={store}>
              <RoutingContext {...renderProps}/>
            </Provider>
          );

          // store state into variable
          const __DATA__ = store.getState();

          const page = this.html
            .replace('__DATA__', serialize(__DATA__))
            .replace('__CONTENT__', __CONTENT__);

          callback(null, null, page);
        })

      // all fetched data is done
      // render our components to string
      // const __CONTENT__ = renderToString(
      //   <Provider store={store}>
      //     <RoutingContext {...renderProps}/>
      //   </Provider>
      // );
      //
      // // store state into variable
      // const __DATA__ = store.getState();
      //
      // const page = this.html
      //   .replace('__DATA__', serialize(__DATA__))
      //   .replace('__CONTENT__', __CONTENT__);
      //
      // callback(null, null, page);
    });
  }
}

module.exports = MainRenderer;

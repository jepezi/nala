# nala

Build and serve React redux app.

## Install

```
npm i nala --save
```

## Start dev server


```
  "scripts": {
    "start": "nala start",
    ...
```

Run `npm start` will tell nala to start hot reloading dev server, with the help of webpack. If your entry file is `src/main.js`, then you don't have to config anything. Your dev server port will be default to 3001. However, if your entry file is different, you need to tell nala with the config file.

## Config

nala will look for `config.js` at the root of the project folder. To tell nala about your entry file, create `config.js` with this config.

```js
module.exports = {
  entry: 'src/main.js', // this is default entry file, change it to yours.
}

```

The typical React redux app would require some npm packages to get started e.g. `react`, `react-dom`, `react-router`, `redux`, `react-redux`. All these packages are owned by nala so you can start write app by import/require them and it will work. Look at the Packages section below for the full list of packages that nala owns.

## Environment variables

Apart from config file, nala also loads env variables from `.env` file (via `dotenv` package), if you create.

For example, you can tell nala to use dev server port other than the default 3001.

```
DEV_PORT=8081
```

## App server

Up to this point, if you run `npm start` on terminal, nala will run dev server with hot reloading for you on port 8081. Now we need an app server (Express.js server) to see our app on the browser.

Before that, let's create new npm script to run our app server.

```
"scripts": {
  ...
  "dev": "NODE_ENV=development node ./bin/server.js"
},
```

Now create `bin/server.js` file.

```js
var nala = require('nala');
var server = nala.createServer();
server.start();

```

Then run it on terminal.

```
npm run dev
```

By default, nala will run Express server on port 3000. If you want to change that, do it in `.env` file like so.

```
PORT=8080 <-------- add this
DEV_PORT=8081
```

Now run `npm run dev` again, and go to browser and see your app running at `localhost:8080`

## Build app

nala uses webpack to bundle script via the `build` command.

```
"scripts": {
  ...
  "build": "rm -rf public/dist && NODE_ENV=production nala build",
},
```

Let's be explicit and set NODE_ENV to production when run `nala build`. Now run `npm run build` on terminal and nala will build our app and output to the default `public/dist/static` folder. If you want to change the output path, let's do it in config file.

```js
// config.js
module.exports = {
  entry: 'src/main.js',
  publicPath: '/dist/tada/', // <-- add this (no need to include public and also make sure to begin with /)
}
```

## Product app server

Production mode enables some good express middlewares (hpp and helmet) and also signals React to drop some expensive but helpful developer features. To tell nala to run server in production mode, just create new npm script.

```
"scripts": {
  ...
  "prod": "NODE_ENV=production node ./bin/server.js",
},
```

Notice that we run the same `bin/server.js` file, with NODE_ENV set to production.

By default, nala runs server and renders React app on client. But we can tell nala to pre-render React app on the server as well.

## Server-side render

To pre-render our React app on the server, we must create `public/prerender.html` file and tell nala to enable SSR in `.env` file.

```
...
SSR=true
```

When we set `SSR=true`, nala will look for any react components with the static method called `fetchData`, which takes redux's store as parameter, and call them. Then it waits until it gets all fetched data, after that it will inject data that it collects to the `public/prerender.html` and send it to browser.

## package.json file

```
  "scripts": {
    "start": "nala start",
    "build": "rm -rf public/dist && NODE_ENV=production nala build",
    "prod": "NODE_ENV=production node ./bin/server.js",
    "dev": "NODE_ENV=development node ./bin/server.js"
  },
```

## Create `public/prerender.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>My Title</title>

  <!-- Bootstrap Core CSS -->
  <link href="/vendor/bootstrap.min.css" rel="stylesheet" type='text/css'>

  <!-- Font awesome -->
  <link href="/vendor/font-awesome.min.css" rel="stylesheet" type='text/css'>

  <!-- Custom CSS -->
  <link href="/css/your-custom-css.css" rel="stylesheet" type='text/css'>
  <link href="__CSS__" rel="stylesheet" type='text/css'>

  <!-- Custom Fonts -->
  <!-- <link href='http://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'> -->

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js" type="text/javascript"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js" type="text/javascript"></script>
  <![endif]-->

</head>

<body>
  <div id="app">__CONTENT__</div>

  <script src="/vendor/jquery.min.js" type="text/javascript"></script>
  <script type="text/javascript">
    var __JSDATA__ = __DATA__;
  </script>
  <script src="__VENDOR__" type="text/javascript"></script>
  <script src="__SCRIPT__" type="text/javascript"></script>
</body>
</html>

```

## Packages

```
npm i \
autoprefixer \
babel-core \
babel-loader \
babel-plugin-transform-react-constant-elements \
babel-plugin-transform-react-inline-elements \
babel-plugin-transform-runtime \
babel-polyfill \
babel-preset-es2015 \
babel-preset-es2015-native-modules \
babel-preset-react \
babel-preset-react-hmre \
babel-preset-stage-2 \
babel-register \
body-parser \
compression \
css-loader \
dotenv \
express \
extract-text-webpack-plugin \
file-loader \
helmet \
hpp \
isomorphic-fetch \
json-loader \
lodash \
node-sass \
normalizr \
postcss-loader \
react@15.0.0-rc.1 \
react-dom@15.0.0-rc.1 \
react-redux \
react-router \
redux \
redux-logger \
rimraf \
sass-loader \
serialize-javascript \
stats-webpack-plugin \
style-loader \
webpack@2.1.0-beta.4 \
webpack-dev-middleware \
webpack-hot-middleware
```

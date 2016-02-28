# nala

## install

```
npm i -S nala
```


## create npm script

```
  "scripts": {
    "start": "nala start",
    "build": "rm -rf public/dist && NODE_ENV=production nala build",
    "prod": "NODE_ENV=production node ./bin/server.js",
    "dev": "NODE_ENV=development node ./bin/server.js"
  },
```

## server `bin/server.js`

```js
var nala = require('nala');
var server = nala.createServer();
server.start();
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
  <title>Clean Blog</title>

  <!-- Bootstrap Core CSS -->
  <link href="/vendor/bootstrap.min.css" rel="stylesheet" type='text/css'>

  <!-- Font awesome -->
  <link href="/vendor/font-awesome.min.css" rel="stylesheet" type='text/css'>

  <!-- Custom CSS -->
  <link href="/css/clean-blog.css" rel="stylesheet" type='text/css'>
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

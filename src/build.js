var path = require('path');
var webpack = require('webpack');

module.exports = function build(cb) {
  console.log(`NODE_ENV=${process.env.NODE_ENV}`)
  if (process.env.NODE_ENV === 'production') {
    buildProduction(cb)
  } else {
    cb()
  }
}

function buildProduction(cb) {
  bundleServer(cb)
}

function bundleServer(cb) {
  console.log('bundling server')
  bundle(require(path.join(__dirname, 'webpack.build.config.js')), cb)
}


function bundle(config, cb) {
  const compiler = webpack(config)
  compiler.run((err, rawStats) => {
    if (err) {
      throw err
    } else {
      const stats = rawStats.toJson()
      if (stats.errors.length) {
        throw stats.errors[0]
      } else {
        // if (saveStats) {
        //   const statsPath = `${config.output.path}/stats.json`
        //   fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
        //   console.log('wrote file', path.relative(APP_PATH, statsPath))
        // }
        cb()
      }
    }
  })
}

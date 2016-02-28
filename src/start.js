module.exports = function start(cb) {
  if (process.env.NODE_ENV === 'production') {
    console.log('dont use it')
  } else {
    require('./hotServer');
  }
}

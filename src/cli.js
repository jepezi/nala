var start = require('./start');
var build = require('./build');

var action = process.argv[2]

var actions = {
  start: start,
  build: build,
}

if (actions[action]) {
  console.log(action)
  actions[action](function () {
    console.log(action + ' complete')
  })
} else {
  console.log(action, 'is not a valid command')
}

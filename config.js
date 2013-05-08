var mkdirp = require('mkdirp')
var config = module.exports = require('rc')('taco-db', {
  path: '/tmp/taco-master',
  root: '/tmp/tacos',
  port: 8000
})

mkdirp.sync(config.root)


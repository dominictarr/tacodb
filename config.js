var mkdirp = require('mkdirp')
var path = require('path')
var os   = require('os')
var config = module.exports = require('rc')('taco', {
  path: path.join(os.tmpdir(), 'taco-master'),
  root: path.join(os.tmpdir(), 'tacos'),
  port: 8000,
  master: 'http://localhost:8000'
})

mkdirp.sync(config.root)


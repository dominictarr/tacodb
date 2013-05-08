
var levelup    = require('levelup')
var sublevel   = require('level-sublevel')
var manifest   = require('level-manifest')
var path       = require('path')
var multilevel = require('multilevel')
var rc         = require('rc')
var fs         = require('fs')

module.exports = function (db, factory) {
  var opts = factory(db)
}

if(!module.parent) {
  var opts = rc('taco', {})

  var db = sublevel(levelup(opts.path, opts))

  var rel = opts.config ? path.dirname(opts.config) : process.cwd()

  var custom = path.resolve(rel, opts.require || opts._[0])
  var manfFile = path.resolve(rel, opts.manifest || 'manifest.json')
  
  var config = 
    module.exports(db, require(custom))

  var manf = manifest(db, true)

  fs.writeFileSync(manfFile, JSON.stringify(manf, null, 2), 'utf-8')

  if(opts.port) {
    var net = require('net')
    net.createServer(function (stream) {
      stream.pipe(process.stderr)
      console.log(manf)
      stream.pipe(multilevel.server(db, manf)).pipe(stream)
    }).listen(opts.port)
  }
}


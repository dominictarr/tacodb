
var levelup  = require('levelup')
var sublevel = require('level-sublevel')
var config   = require('./config')
var securify = require('securify')

var DB = require('./db')

var db = sublevel(levelup(config.path))
var dbs = {}

db.sublevel('bundles').post(function (op) {
  //  either start the server, or destroy the current server,
  //  and then create a new server...
  //
  //  when a bundle is pushed, destroy the current server,
  //  and start a new one...
  //
  //  this will close the current database,
  //  and cleanup the domain it runs in.
  //
  //  so, the user can decide whether they want to cleanup
  //  or just crash - but I recommend having a crashable design.
  
  var db = dbs[op.key] || dbs[op.key] = DB(op.key)
  // Turn op.value into a function...
  db.update(op.value)
})



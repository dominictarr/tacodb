var levelup  = require('level')
var config   = require('./config')
var securify = require('securify')
var bundle   = require('securify/bundle')
var path     = require('path')
var EventEmitter
             = require('events').EventEmitter

// (update closing update* closed updated)*
// update can be a new bundle, or stop.
// a db must always asynchronously close before
// a new bundle is activated.

// how should I test this?
// make a simple app, and update it.
module.exports = 
function Db(id) {
  var db, _cb
  var state = 'ready'
  var bundle, current

  var domain

  var emitter = new EventEmitter()

  function close (cb) {
    var n = 1

    db.on('closed', function () {
      if(--n) return
      domain.dispose()
      cb()
    })

    db.on('error', function (err) {
      if(--n) return
      domain.dispose()
      cb(err)
    })

    db.close()
  }

  var events = ['console_log', 'console_error', 'error']
  var db_events = ['ready', 'closed']

  function reemit (source, events) {
    var removers = []

    events.forEach(function (event) { 
      function onEvent (value) {
        emitter.emit('log', event, value)
      }
      source.on(event, onEvent)
      removers.push(function () {
        source.removeListener(event, onEvent)
      })
    })
    return function () {
      removers.forEach(function (e) { e() })
    }
  }

  function start (bundle, cb) {
    //EVENT: updated
    state = 'running'
    db = levelup(path.join(config.root, id))
    domain = securify(bundle)(db)

    db.once('closed', reemit(domain, events))
    db.once('closed', reemit(db, db_events))

    emitter.db = db
    emitter.domain = domain
    cb && cb(null, db, domain)
  }

  emitter.update = function (_bundle, cb) {

    //EVENT: update
    bundle = _bundle
    if(state == 'ready') {
      start(_bundle, cb)
    }
    else if (state == 'running') {
      //EVENT: closing
      state = 'closing'
      close(function (err) {
        if(err) return cb(err)
        state = 'ready'
        start(bundle, cb)
      })
    }
  }

  return emitter
}

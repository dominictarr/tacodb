var levelup  = require('levelup')
var config   = require('./config')
var securify = require('securify')
var bundle   = require('securify/bundle')
var path     = require('path')

// (update closing update* closed updated)*
// update can be a new bundle, or stop.
// a db must always asynchronously close before
// a new bundle is activated.

// how should I test this?
// make a simple app, and update it.
module.exports = 
function Db(id) {
  var db = levelup(path.join(config.root, id))
  var state = 'ready'
  var bundle, current

  var domain

  function start () {
    //EVENT: updated
    state = 'running'
    current = bundle
    domain = securify(bundle)(db)
  }

  db.on('closed', function () {
    //EVENT: closed
    //was closing the database...
    domain && domain.dispose()
    if(bundle == current) {
      //EVENT: stopped
      return
    }
    start()
  })

  db.update = function (_bundle) {
    //update wasn't a change, do nothing...
    if(current == _bundle) return

    //EVENT: update
    bundle = _bundle
    if(state == 'ready') {
      start()
    }
    else if (state == 'running') {
      //EVENT: closing
      state = 'closing'
      db.close()
    }
  }

  return db
}

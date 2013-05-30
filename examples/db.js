var sublevel   = require('level-sublevel')
var MapReduce  = require('map-reduce')
var multilevel = require('multilevel')
var static     = require('level-static')

return module.exports = function (db) {

  db.options.valueEncoding = 'json'

  sublevel(db)
  console.log('STARTED')

  db.on('connection', function (stream) {
    console.error('CONNECTION', stream)
  })

  console.error('http', static(db.sublevel('static')))

  db.on('http_connection', static(db.sublevel('static')))

  MapReduce(db, 'map', function (key, value, emit) {
    emit(typeof value, 1) 
  }, function (acc, item) {
    return Number(acc || 0) + Number(acc || 1)
  })
}


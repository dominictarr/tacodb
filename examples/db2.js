var sublevel = require('level-sublevel')
var MapReduce = require('map-reduce')
var multilevel = require('multilevel')

return module.exports = function (db) {

  db.options.valueEncoding = 'json'

  sublevel(db)

  MapReduce(db, 'map', function (key, value, emit) {
    emit(typeof value, 1) 
  }, function (acc, item) {
    return Number(acc || 0) + Number(acc || 1)
  })

  db.on('connect', function (stream) {
    stream.pipe(multilevel.server(db)).pipe(stream)
  })
}



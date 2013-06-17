var multilevel = require('multilevel')

module.exports = function (db) {
  db.on('connection', function (stream) {
    stream.pipe(multilevel.server(db)).pipe(stream)
  })
}

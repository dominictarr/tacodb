var static = require('level-static')

module.exports = function (db) {
  db.on('http_connection', static(db))
}

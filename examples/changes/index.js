var static   = require('level-static')
var through  = require('through')
var route    = require('tiny-route')
var live     = require('level-live-stream')
var stack    = require('stack')

module.exports = function (db) {
  //level-static creates a http handling middleware around leveldb.
  db.on('http_connection', stack(
    route.get('/_changes', function (req, res) {
      live(db)
        .pipe(through(function (data) {
          this.queue(JSON.stringify(data) + '\n')
        }))
        .pipe(res)
      req.resume()
    }),
    static(db)
  ))
}


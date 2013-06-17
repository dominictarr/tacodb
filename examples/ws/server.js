var multilevel = require('multilevel')
var fs         = require('fs')
var index = fs.readFileSync(__dirname + '/index.html','utf8')

console.log(index.length)

module.exports = function (db) {
  db.on('http_connection', function (req, res) {
    req.resume()
    res.end(index)
  })
  db.on('connection', function (stream) {
    console.log('connect')
    stream.pipe(multilevel.server(db)).pipe(stream)
  })
}

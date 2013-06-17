
var multilevel = require('multilevel')
var reconnect  = require('reconnect')

reconnect(function(stream) {
  var db = multilevel.client()
  stream.pipe(db).pipe(db)

  db.put('hi', 'Hello', function (err) {
    if(err) return console.error(err)
    db.get('hi', function (err, value) {
      if(err) return console.error(err)
      console.log('GET', value)
    })
  })
}).connect('/ws/ws')

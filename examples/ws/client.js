
var multilevel = require('multilevel')
var reconnect  = require('reconnect/sock')

//This client works from both the browser and in node!
//WebSockets everywhere!

//use `npm run build` to generate the index.html file.

var node = process.title != 'browser'

var log = (node ? console.log :
  function () {
    var data = [].slice.call(arguments).map(function (e) {
      return JSON.stringify(e, null, 2)
    }).join(' ')
    var pre = document.createElement('pre')
    pre.innerText = data
    document.body.appendChild(pre)
  })

reconnect(function(stream) {
  log('connected!')
  var db = multilevel.client()
  stream.pipe(db).pipe(stream)

  setInterval(function () {
    db.put('hi', new Date(), function (err) {
      if(err) return console.error(err)
      db.get('hi', function (err, value) {
        if(err) return console.error(err)
        log('GET', 'hi', value)
      })
    })
  }, 1000)

}).connect(node ? 'http://localhost:8000/ws/ws' : '/ws/ws')
//^ on the browser, this assumes you are on the same host as window.location...

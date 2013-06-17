## connecting to tacodb/level via http

Create a database customization file...
This will expose an http interface,
that can store files inside leveldb.

``` js
//examples/http/index.js

var static = require('level-static')

module.exports = function (db) {
  db.on('http_connection', static(db))
}

```

``` 
>tacodb local static.js --name static
listening on 8000
```

This starts a tacodb server running around your `db.js` file.

``` js
#http PUT hi = HELLO
echo 'HELLO!' | curl -sSNT . localhost:8000/hi
#http GET hi
curl localhost:8000/hi
HELLO!
```


## Add real time logging

`level-static` extend the simple http example,
so that we can track changes as they occur.

``` js
//examples/changes/index.js

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

```

start the server...

``` js
tacodb local ./index.js --name changes
```

Then, connect and stream changes like this:

```
curl localhost:8000/_changes
```

Then in another terminal:

```
echo 'Hi!' | curl -sSNT . localhost:8000/hi
echo 'whats up?' | curl -sSNT . localhost:8000/wazzup
echo 'Good Bye!' | curl -sSNT . localhost:8000/bye
```


## connect to tacodb/level over websockets

Create a streaming connection with websockets!

First, the server:

``` js
//examples/ws/server.js

var multilevel = require('multilevel')
var fs         = require('fs')
var index
try {
  index = fs.readFileSync(__dirname + '/index.html','utf8')
} catch (err) {
  console.error("run `npm run build` to generate the html file")
  throw err
}
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

```

Then, the client.

``` js
//examples/ws/client.js


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

```

this client can be used from both the browser and node.js!

start the server
``` js
tacodb local server.js --name ws
```

connect from node:

``` js
node client.js
```

or from the [browser](http://localhost:8000/)



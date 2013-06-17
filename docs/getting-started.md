
# Getting Started

install `tacodb`
``` js
npm install -g tacodb
```

create a new project.

```
mkdir hellotaco
cd hellotaco
npm init #press enter to accept defaults...
npm install level-static
```

## Add Http access to tacodb

Create a database customization file...
This will expose an http interface,
that can store files inside leveldb.

```
//static.js
var static = require('level-static')

module.exports = funtion (db) {
  //level-static creates a http handling middleware to leveldb.
  db.on('http_connection', static(db))
}
```
Then, for testing, we can start the database locally...

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
//changes.js
var static  = require('level-static')
var through = require('through')
var route   = require('tiny-route')
var live    = require('level-live-stream')

module.exports = function (db) {
  //level-static creates a http handling middleware to leveldb.
  db.on('http_connection', Stack(
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



## Getting Started

start by installing `tacodb`

``` js
npm install -g tacodb
```

Then, create an customization file

``` js
//db.js
//creat a static http style interface to leveldb.
var static = require('level-static')
module.exports = function (db) {
  db.on('http_connection', static(db))
}
```

start the server locally.

``` js
tacodb local db.js --port 8000
```

``` js
echo hello | curl -sSNT . -X PUT http://localhost:8000/greeting
curl http://localhost:8000/greeting
```

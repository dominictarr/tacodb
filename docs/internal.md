## API

expose your app with `module.exports`

``` js
module.exports = function (db) {
  db.on('connection', function (ws) {
    //handle websocket stream
  })
  db.on('http_connection', function (req, res) {
    //handle http request
  })
}
```

`db` is a [levelup](https://github.com/rvagg/node-levelup) instance.

### on("connection", function (stream){...})

emitted on a websocket connection to tacodb.

### on("http_connection", function (req, res) {...})

emitted on a http connection to tacodb.

## Routes

When `tacodb` is run globally, with `tacodb start`
each service is prefixed with /http/NAME/

When `tacodb` is run locally, with `tacodb local file --name foo`
then routes are unprefixed.



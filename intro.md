
# TacoDb

## install client

```
npm install -g tacodb
echo '{ "master": "http://taco-db.com:8000" }' > ~/.tacorc
```

## write app

Write a tacodb "app".

``` js
//index.js
var static = require('level-static')

module.exports = function (db) {
  db.on('http_connection', static(db)
}
```

## deploy it

```
tacodb update index.js --name foo

echo WORLD | curl -sSnT . -X PUT http://tacodb.org/http/foo/hello
curl http://tacodb.org/http/foo/hello
```

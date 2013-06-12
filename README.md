# tacodb

reusable leveldb server

## Synopsis

tacodb wraps leveldbs in a server such that it would be possible
to create a hosted service with it, that can be connected to via
http and web sockets.

You database is configured by writing a .js file, which is then
bundled (a la browserify) and sent to the tacodb server via http.

## Example

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
tacodb local db.js --port 8080
```

``` js
echo hello | curl -sSNT . -X PUT http://localhost:8080/greeting
curl http://localhost:8080/greeting
```

## Commands

All command line options may also be set in a 
`.tacorc` file. [rc](https://github.com/dominictarr/rc) is used
for configuration.

All of the options in the following examples are the default options.

### tacodb start

Start a tacodb server.
use `tacodb update` command to create databases in it.

```
tacodb local --port 8000 \
             --root /tmp/tacos \
             --path /tmp/taco-master
```

### tacodb local

Start a database instance locally. Useful for testing.

``` js
tacodb local --port 8000 \
             --root /tmp/tacos \
             --name foo
```

### tacodb update

Update a database customization. The entry file is bundled,
and then sent to the `tacodb` server via http.

``` js
tacodb update --main entry.js \
              --master http://localhost:8000 \
              --name foo
```

### tacodb config

Dump tacodb config from current directory.
(will load config searching for local `.tacorc`)
and print all config as JSON.

### tacodb logs



``` js
tacodb logs --name foo --tail --since now
```

## SmartOS Deploy 

Running the following actions will enable tacodb as a service on SmartOS
The default is port 8000 as defined in the ```exec_method``` tag.
N.B Test on Standard64 1.0.7 with a downloaded install of node.js 0.10.10 

```
# cd deploy
# svccfg import tacodb-service-manifest.xml 
# svcadm enable tacodb-service
```

## License

MIT

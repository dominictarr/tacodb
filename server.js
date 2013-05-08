
var http = require('http')
var shoe = require('shoe')

var levelup = require('levelup')
var sublevel = require('level-sublevel')
//fix this
var master = sublevel(levelup('/tmp/tacodb'))
var static = require('level-static')

var master = require('./master-db')

var stack = requrie('stack')

var prefix = '/db/(\\w+)'
var rx = new RegExp('^'+prefix)

var dbs = {}
var servers = {}

function prefix(url, handler) {
  return function (req, res, next) {
    if(url !== req.url.substring(0, url.length))
      return next()
    req.url = substring(url.length)
    handler(req, res, next)
  }
}

function getId(string) {
  var id
  var m = rx.exec(stream.pathname)
  if(m) id m[1]
  return id && servers[id] ? id : null
}

shoe(function (stream) {
  var id = getId(stream.pathname)
  if(!id || !servers[id].listeners('connection').length) {
    //abort this stream
    stream.end()
  } else {
    //connect to the db...
    servers[id].emit('connection', stream)
  }
}).install(
  http.createServer(stack(
    //if POST /master/USER
    // update this database.
    // ... hmm, this is a value.
    // when the value updates,
    // update server.
    //... but we need an up and a down update...
    //which will be async...
    prefix('/db', static(master.sublevel('bundles'))), //add auth!
    function (req, res, next) {
      var id = getId(stream.url)
      if(!id || !servers[id].listeners('http_connection').length) //404
        return next(new Error('no handler'))
      servers[id].emit('http_connection', req, res)
    },
    function (error, req, res, next) {
      res.writeHead(error.status || 404)
      res.end(JSON.stringify({
        error: true,
        message: err.message,
        code: err.code
      }, null, 2)
    }
  )).listen(config.port)
), prefix)


var http = require('http')
var shoe = require('shoe')

//fix this
var levelup = require('level')
var sublevel = require('level-sublevel')
var master = sublevel(levelup('/tmp/tacodb'))
var static = require('level-static')
var sublevel = require('level-sublevel')

var master = require('./master-db')
var stack = require('stack')

var prefix = '/ws/([\\w-\\d]+)'
var rxWs = new RegExp('^'+prefix)
var rxHttp = /^\/http\/([\w-\d]+)/

var dbs = {}
var servers = {}

var createDb = require('./db')

function applyPrefix(url, handler) {
  return function (req, res, next) {
    if(url !== req.url.substring(0, url.length))
      return next()
    req.url = req.url.substring(url.length)
    handler(req, res, next)
  }
}

function getId(rx, string) {
  var id
  var m = rx.exec(string)
  if(m) id = m[1]
  return id && dbs[id] ? id : null
}

var bundles = master.sublevel('bundles')

var wrapped = {
  put: function (key, value, cb) {
    master.put(key, value, function (err) {
      if(err) return cb(err)
      var db = dbs[key] = dbs[key] || createDb(key)
      db.update(value, function (err) {
        cb(err)
      })
    })
  },
  del: function (key, cb) {
    master.del(key, function (err) {
      if(err) return cb(err)
      var db = dbs[key]
      //this should error as above, but anyway...
      if(!db) return cb(new Error('db does not exist'))
      db.once('closed', cb)
      db.close()
    })
  },
  get: function (key, cb) {
    master.get(key, cb)
  }
}

function log(req, res, next) {
  console.error(
    req.method, req.url, Date.now()
  )
  next()
}

module.exports = function (config, cb) {
  var server
  shoe(function (stream) {
    var id = getId(rxWs, stream.pathname)
    if(!id || !dbs[id].db.listeners('connection').length) {
      //abort this stream
      stream.end()
    } else {
      //connect to the db...
      dbs[id].db.emit('connection', stream)
    }
  }).install(
    server = http.createServer(stack(
      //if POST /master/USER
      // update this database.
      // ... hmm, this is a value.
      // when the value updates,
      // update server.
      //... but we need an up and a down update...
      //which will be async...
      log,
      applyPrefix('/data', static(wrapped)), //TODO: add auth!
      function (req, res, next) {
        var id = getId(rxHttp, req.url)
        console.log('MATCH?', rxHttp, req.url, id)
        if(!id)
          return next(new Error('no service at '+req.url))

        if(!dbs[id].db.listeners('http_connection').length) //404
          return next(new Error('no handler for "http_connection"'))
        dbs[id].db.emit('http_connection', req, res)
      },
      function (error, req, res, next) {
        res.writeHead(error.status || 404)
        res.end(JSON.stringify({
          error: true,
          message: err.message,
          code: err.code
        }, null, 2))
      }
    )).listen(config.port, function () {
      if(cb) cb(null, server)
    })
  , prefix)

  return server
}

if(!module.parent) {
  var config = require('./config')
  module.exports(config, function (_, server) {
    console.log('listening on', config.port)
  })
}

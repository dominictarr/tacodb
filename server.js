var http       = require('http')
var url        = require('url')
var qs         = require('querystring')

var shoe       = require('shoe')
var stack      = require('stack')
var timestamp  = require('monotonic-timestamp')

var levelup    = require('level')
var sublevel   = require('level-sublevel')
var static     = require('level-static')

var pull       = require('pull-stream')
var toPull     = require('stream-to-pull-stream')
var pl         = require('pull-level')
var LiveStream = require('level-live-stream')
var through    = require('through')

var master     = require('./master-db')
var createDb   = require('./db')

var prefix     = '/ws/([\\w-\\d]+)'
var rxWs       = new RegExp('^'+prefix)
var rxHttp     = /^\/http\/([\w-\d]+)/

var dbs        = {}
var servers    = {}

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

var bundles   = master.sublevel('bundles')
var logs      = master.sublevel('logs')
var logStream = logs.createWriteStream()

// *************************************
//  XXX: TODO: save logs in another db. 
// *************************************

function log(req, res, next) {
  console.error(
    req.method, req.url, Date.now()
  )
  next()
}

function tail(name, opts) {
  opts.min = name + '\x00' + (opts.min || opts.since || Date.now())

  for(var k in opts)
    if(opts[k] === 'false') opts[k] = false

  opts.max = name + '\x00\xff'

  return LiveStream(logs, opts)
    .on('data', function (data) {
      try { data.value = JSON.parse(data.value) } catch (_) {}
    })
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
      //      log,
      function (req, res, next) {
        var u = url.parse(req.url)
        req.opts = qs.parse(u.query)
        req.pathname = u.pathname
        next()
      },
      applyPrefix('/log', function (req, res, next) {
        var m = /\/([\w-\d]+)/.exec(req.url)
        var name = m && m[1]
        if(!dbs[name])
          return next(new Error('no database:'+name))
        req.resume()
          
        tail(name, req.opts)
          .pipe(through(function (data) {
            this.queue(JSON.stringify(data) + '\n')
          })).pipe(res)
      }),
      applyPrefix('/data', static(bundles)), //TODO: add auth!
      function (req, res, next) {
        var id = getId(rxHttp, req.url)

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

  // instead of creating a new db on each update
  // just tail the database, and update dbs that way!
  // this essentially just syncronizes the state of the dbs
  // with the state of the dbs.
  //
  // SO Simple!

  pl.read(bundles, {tail: true})
    .pipe(pull.drain(function (data) {
      var key = data.key
      var bundle = data.value
      if(bundle) {
        
        var db = dbs[key]

        if(!db) {
          db = dbs[key] = createDb(key)
          db.on('log', function (event, value) {
            logStream.write({
              key: key + '\x00' + timestamp(),
              value: JSON.stringify({event: event, value: value})
            })
          })
        }

        db.update(bundle)
      }  else {
        var db = dbs[key]
        if(db) db.close()
      }
    }))

  return server
}

if(!module.parent) {
  var config = require('./config')
  module.exports(config, function (_, server) {
    console.log('listening on', config.port)
  })
}


#! /usr/bin/env node

var http    = require('http')
var path    = require('path')
var cp      = require('child_process')

var shoe    = require('shoe')
var levelup = require('level')
var request = require('request')
var split   = require('split')
var through = require('through')

var bundle  = require('securify/bundle')
var config  = require('./config')

var commands = {
  bundle: function (config, cb) {
    bundle(config._[0])
      .pipe(
        config.o ? fs.createWriteStream(config.o)
                 : process.stdout
      )
  },
  update: function (config, cb) {
    bundle(
      config.main || config._[0] || './index.js'
    , function (err, bundle) {
      if(err) return cb(err)
      request.put(
        config.master + '/data/' + config.name
      , function (err, res, body) {
        if(err) cb(err)
        else if(res.statusCode >= 300)
          cb(new Error(body || res.statusCode))
        else
          cb()
      }).end(bundle)
    })
  },
  local: function (config, cb) {
    if(!config.name) {
      console.error('must provide --name NAME')
      process.exit(1)
    }
    var main = config.main || config._[0] || './index.js'
    var dir = path.join(config.root, config.name)
    var db = levelup(dir)//, {encoding: 'json'})


    var setup = require(path.resolve(main))
    setup(db)
    shoe(function (stream) {
      db.emit('connection', stream)
    }).install(
      http.createServer(function (req, res) {
        db.emit('http_connection', req, res)
      }).listen(config.port, function () {
        console.error('tacodb listening on:', config.port)
      }), '/ws/' + config.name
    )
  },
  start: function (config, cb) {
    require('./server')(config, function (err) {
      if(err) return cb(err)
      console.error('tacodb listening on:', config.port)
      cb()
    })
  },
  config: function (config, cb) {
    console.log(JSON.stringify(config, null, 2))
    cb()
  },
  log: function (config, cb) {

    request({
      uri: config.master + '/log/' + config.name,
      qs: {
        min: config.since || config.min,
        max: config.until || config.max,
        tail: config.tail
      }
    })
    .pipe(split(null, null, JSON.parse))
    .pipe(through(console.log))

    cb()
  },
  //install tacodb plugin.
  install: function (config, cb) {
    var args = config._.slice()
    console.error('installing tacodb extension:', args.join(' '))
    args.unshift('install')
    cp.spawn('npm', args, {stdio: 'inherit', cwd: __dirname})
    .on('exit', cb)
  }
}

var command = config._.shift()

function exec (cmd, cb) {
  if(!cmd) return cb()
  console.error('>', cmd)
  cp.exec(cmd, cb)
}

function run (command, cb) {
  exec(config.on && config.on['pre-' + command], function (err) {
    if(err) return cb(err)
    commands[command](config, function (err) {
      if(err) return cb(err)
      exec(config.on && config.on['post-' + command], function (err) {  
        cb(err)
      })
    })
  })
}

run(command, function (err) {
  if(err) throw err
})


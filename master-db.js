
var levelup  = require('level')
var sublevel = require('level-sublevel')
var config   = require('./config')
var securify = require('securify')

var DB = require('./db')

var db = sublevel(levelup(config.path))
var dbs = {}

module.exports = db

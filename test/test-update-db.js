
var createDb = require('../db')

var boxedDb = createDb('RANDOM'+~~(Math.random()*1000000))
var fs = require('fs')
var bundle   = require('securify/bundle')

var pull = require('pull-stream')
var pl   = require('pull-level')

var test = require('tape')

process.on('uncaughtException', function (e) {
  console.error(e.stack)
})

test('update', function (t) {

  bundle(__dirname+'/../examples/db.js', function (err, b) {
    bundle(__dirname+'/../examples/db2.js', function (err, b2) {
      console.log('BUNDLED')
      boxedDb.update(b, function (err, db, domain) {
        console.log('UPDATED')
        pull.values([
          {key: 'a', value: 'apple'},
          {key: 'b', value: 'banana'},
          {key: 'c', value: 'cherry'},
          {key: 'd', value: 'durian'},
          {key: 'e', value: 'elder-berry'}
        ]).pipe(pl.write(db, function (err) {

          db.get('e', function (err, value) {
            boxedDb.update(b2, function (err, _db, domain) {

              pl.read(_db)
              .pipe(pull.reduce(function (a, e) {
                a[e.key] = e.value
                return a
              }, {}, function (err, all) {
                console.log(all)
                t.deepEqual(all, { a: 'apple',
                  b: 'banana',
                  c: 'cherry',
                  d: 'durian',
                  e: 'elder-berry' 
                })
                t.end()
              }))
            }) 
          })
        }))
      })
    })
  })
})

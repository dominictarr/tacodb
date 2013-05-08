
var createDb = require('../db')

var db = createDb('RANDOM'+~~(Math.random()*1000000))
var fs = require('fs')
var bundle   = require('securify/bundle')

var pull = require('pull-stream')
var pl   = require('pull-level')

bundle(__dirname+'/../examples/db.js', function (err, b) {
  bundle(__dirname+'/../examples/db2.js', function (err, b2) {

    db.update(b)

    console.log(db)

    pull.values([
      {key: 'a', value: 'apple'},
      {key: 'b', value: 'banana'},
      {key: 'c', value: 'cherry'},
      {key: 'd', value: 'durian'},
      {key: 'e', value: 'elder-berry'}
    ]).pipe(pl.write(db, function (err) {

      db.get('e', function (err, value) {

        console.log(value)

        db.update(b2, function (err) {
          console.log('updated')
        })
 
      })

    }))

  })
})

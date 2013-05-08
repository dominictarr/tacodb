var manifest   = require('level-manifest')
var path       = require('path')
var multilevel = require('multilevel')
var rc         = require('rc')

if(!module.parent) {
  var net = require('net')
  var opts = rc('taco', {})

  var rel = opts.config ? path.dirname(opts.config) : process.cwd()
  var manfFile = path.resolve(rel, opts.manifest || 'manifest.json')

  var manf = opts.manifest && JSON.parse(fs.readFileSync(manfFile))

  var stream = net.connect(opts.port)

  var db = multilevel.client(manf)
  stream.pipe(db).pipe(stream)

  var cmd = opts._[0]

  if(/^(put|get|del|batch)$/i.test(cmd)) {
    var op = opts._.shift().toLowerCase()
    var args = opts._.slice()
    args.push(function (err, value) {
      if(err)
        throw err
      if(value != null)
        process.stdout.write(value)
      db.close()
    })
    db[op].apply(db, args)
  } else if(/^read$/i.test(cmd)) {
    db.createReadStream(opts)
    .on('data', console.log)
    .on('end', function () {
      db.close()
    })
  }
}

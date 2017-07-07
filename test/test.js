var path = require('path')
var spawn = require('child_process').spawn
var tape = require('tape')
var fs = require('fs-extra')

var swaggergen = path.resolve(__dirname, '../index.js')
var swaggerJSON = path.resolve(__dirname, './data/swagger.json')

var defaultDist = path.resolve(__dirname, 'swagger-dist')
var defaultIndex = path.resolve(defaultDist, 'index.html')

var customDist = path.resolve(__dirname, 'custom-dist')
var customIndex = path.resolve(customDist, 'index.html')

var ui = fs.readFileSync(path.resolve(__dirname, '../html/ui.html'))

tape.test('swaggergen creates a new dist and exits with code 0', function(t) {
  t.plan(4)
  var cmd = 'node ' + swaggergen + ' ' + swaggerJSON
  console.log(cmd)
  var child = spawn('node', [swaggergen, swaggerJSON], {cwd: __dirname})
  child.on('close', function(code) {
    t.equal(code, 0)
    t.ok(fs.existsSync(defaultDist))
    t.ok(fs.existsSync(path.resolve(defaultDist, 'swagger-json.js')))
    t.ok(fs.readFileSync(defaultIndex, 'utf8').includes(ui))
    fs.removeSync(defaultDist)
  })
})

tape.test('swaggergen creates a new dist in a specified dir and exits with code 0', function(t) {
  t.plan(4)
  var child = spawn('node', [swaggergen, swaggerJSON, '-d', customDist], {cwd: __dirname})
  child.on('close', function(code) {
    t.equal(code, 0)
    t.ok(fs.existsSync(customDist))
    t.ok(fs.existsSync(path.resolve(customDist, 'swagger-json.js')))
    t.ok(fs.readFileSync(customIndex, 'utf8').includes(ui))
    fs.removeSync(customDist)
  })
})

tape.test('swaggergen creates a new dist when swagger file is piped in', function(t) {
  t.plan(4)
  var child = spawn('node', [swaggergen], {cwd: __dirname})
  fs.createReadStream(swaggerJSON).pipe(child.stdin)
  child.on('close', function(code) {
    t.equal(code, 0)
    t.ok(fs.existsSync(defaultDist))
    t.ok(fs.existsSync(path.resolve(defaultDist, 'swagger-json.js')))
    t.ok(fs.readFileSync(defaultIndex, 'utf8').includes(ui))
    fs.removeSync(defaultDist)
  })
})
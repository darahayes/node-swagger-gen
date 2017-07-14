#!/usr/bin/env node
'use strict'
const fs = require('fs-extra')
const path = require('path')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2), {
  alias: {
    'url': ['baseUrl', 'u'],
    'dest': ['d', 'o'],
    'help': 'h'
  }
})

parse(argv, (parsed) => {
  var srcDist = path.dirname(require.resolve('swagger-ui-dist'))
  buildDist(srcDist, parsed.dest, parsed.swaggerFile)
  console.log('created static swagger site in', argv.dest)
})

function parse (argv, callback) {
  if (argv.help) help(0)

  argv.dest = path.resolve(process.cwd(), argv.dest || 'swagger-dist')

  if (argv._[0]) {
    argv.swaggerFile = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv._[0]), 'utf8'))
    callback(argv)
  } else if (!process.stdin.isTTY) {
    var pipe = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', function (chunk) { pipe += chunk })
    process.stdin.on('end', function () {
      argv.swaggerFile = JSON.parse(pipe.trim())
      return callback(argv)
    })
  } else {
    console.error('Missing swagger JSON file')
    help(1)
  }
}

function buildDist (srcDist, dest, swaggerFile) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  } else if (fs.lstatSync(dest).isFile()) {
    console.error('A file ' + dest + ' already exists')
    process.exit(1)
  }

  fs.copySync(srcDist, dest)

  var swaggerJSONScript = 'var swaggerJSON = ' + JSON.stringify(swaggerFile)
  var currentHTML = fs.readFileSync(path.resolve(dest, 'index.html'), 'utf8')
  var replacementHTML = fs.readFileSync(path.resolve(__dirname, 'html', 'ui.html'))
  var newHTML = currentHTML.replace(/(<script>\nwindow.onload = function\(\) \{[.\s\S]*<\/script>)/, replacementHTML)

  fs.writeFileSync(path.resolve(dest, 'swagger-json.js'), swaggerJSONScript, 'utf8')
  fs.writeFileSync(path.resolve(dest, 'index.html'), newHTML, 'utf8')

  var unwantedFiles = ['.npmignore', 'package.json', 'README.md']
  cleanDir(dest, unwantedFiles)
}

function cleanDir (dir, files) {
  files.forEach(function (file) {
    try {
      fs.removeSync(path.resolve(dir, file))
    } catch (e) {
      console.log('warning: couldn\'t clean file ', path.resolve(dir, file))
    }
  })
}

function help (code) {
  console.log(fs.readFileSync(path.resolve(__dirname, './help.txt'), 'utf8'))
  process.exit(code)
}

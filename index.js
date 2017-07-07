#!/usr/bin/env node
'use strict'
const fs = require('fs-extra')
const path = require('path')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2), {
  alias: {
    'url': ['baseUrl', 'u'],
    'dest': ['d']
  }
})

function parse (argv, callback) {
  console.log(argv)

  argv.dest = path.resolve(process.cwd(), argv.dest || 'swagger-dist')

  if (process.stdin.isTTY) {
    if (!argv._[0]) {
      console.error('Missing swagger JSON file')
      help(1)
    }
    argv.swaggerFile = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv._[0]), 'utf8'))
    callback(argv)
  } else {
    var pipe = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => { pipe += chunk })
    process.stdin.on('end', () => {
      argv.swaggerFile = JSON.parse(pipe.trim())
      return callback(argv)
    })
  }
}

parse(argv, (parsed) => {
  var srcDist = path.resolve(__dirname, 'node_modules/swagger-ui-dist')
  buildDist(srcDist, parsed.dest, parsed.swaggerFile)
  console.log('created statcic swagger site in', argv.dest)
})

function buildDist(srcDist, dest, swaggerFile) {

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }
  else if (fs.lstatSync(dest).isFile()) {
    console.error('A file ' + dest + ' already exists')
    process.exit(1)
  }

  fs.copySync(srcDist, dest)

  var swaggerJSONScript = 'var swaggerJSON = ' + JSON.stringify(swaggerFile)
  var currentHTML = fs.readFileSync(path.resolve(dest, 'index.html'), 'utf8')
  var replacementHTML = fs.readFileSync(path.resolve(__dirname, 'data', 'ui.html'))
  var newHTML = currentHTML.replace(/(<script>\nwindow.onload = function\(\) \{[.\s\S]*<\/script>)/, replacementHTML)
  
  fs.writeFileSync(path.resolve(dest, 'swagger-json.js'), swaggerJSONScript, 'utf8')
  fs.writeFileSync(path.resolve(dest, 'index.html'), newHTML, 'utf8')

  var unwantedFiles = ['.npmignore', 'package.json', 'README.md']
  cleanDist(dest, unwatedFiles)
}

function cleanDist(dist, files) {
  files.forEach(function(file) {
    try {
      fs.removeSync(path.resolve(dist, file))
    }
    catch (e) {
      console.log('warning: couldn\'t clean file ', path.resolve(dist, file))
    }
  })
}

function help (code) {
  console.log(fs.readFileSync(path.resolve(__dirname, './help.txt'), 'utf8'))
  process.exit(code)
}
const path = require('path')
const url = require('url')
const http = require('http')
const { app, BrowserWindow } = require('electron')
const serveStatic = require('serve-static')
require('electron-reload')(__dirname)
require('electron-debug')({ enabled: true })

let win
function devices (cb) {
  const chromecasts = require('chromecasts')()
  chromecasts.on('update', function (player) {
    cb(chromecasts.players)
  })
  chromecasts.on('error', console.log)
}

function serve (dirname) {
  const serve = serveStatic(dirname)
  const server = http.createServer((req, res) => {
    serve(req, res, () => res.end())
  })
  server.listen(3001)
  return server
}

function createWindow () {
  win = new BrowserWindow({
    width: 960,
    height: 540,
    icon: path.resolve(__dirname, 'logo.png')
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))
  win.setMenu(null)
  win.argv = process.argv
  win.chromecasts = {
    devices,
    serve
  }
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

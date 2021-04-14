'use strict'
// ignoring this file in standard

const net = require('net')

let portrange = 45032

// https://gist.github.com/mikeal/1840641
// doesn't use standard errback pattern for rescursive convenience
function getPort (cb) {
  const port = portrange
  portrange += 1

  const server = net.createServer()
  server.listen(port, function (err) {
    server.once('close', function () {
      cb(port)
    })
    server.close()
  })
  server.on('error', function (err) {
    getPort(cb)
  })
}

module.exports = getPort

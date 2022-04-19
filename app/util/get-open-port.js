'use strict'

function getPort (cb) {
  const randomPort = Math.floor(Math.random() * (65535 - 49152) + 49152)
  console.log('assigning', randomPort)
  return setImmediate(cb.bind(null, randomPort))
}

module.exports = getPort

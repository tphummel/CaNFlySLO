'use strict'

const url = require('url')
const tap = require('tap')
const get = require('simple-get')
const waterfall = require('run-waterfall')

const getPort = require('./app/util/get-open-port.js')
const dbTestUtils = require('./app/util/db-test.js')

tap.test('GET /', function (t) {
  const lib = require('./index.js')
  const dbfile = dbTestUtils.getFilename()
  process.env.DBFILE = dbfile

  waterfall([
    (cb) => { dbTestUtils.setup(dbfile, cb) },
    // gotcha: getPort doesn't use standard errback pattern, for reasons.
    (stdout, stderr, cb) => { getPort((port) => { return cb(null, port) }) },
    (port, cb) => {
      const server = lib.start(lib.app, port, (err) => {
        t.ifErr(err)

        get({
          url: url.format({
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/',
            port: port
          })
        }, (err, res) => {
          t.ifErr(err)
          t.equal(res.statusCode, 200)

          server.close(cb)
        })
      })
    }
  ], (err) => {
    t.ifErr(err)
    t.end()
  })
})

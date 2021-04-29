'use strict'

const url = require('url')
const tap = require('tap')
const { v4: uuidv4 } = require('uuid')
const get = require('simple-get')
const waterfall = require('run-waterfall')

const getPort = require('./app/util/get-open-port.js')
const dbTestUtils = require('./app/util/db-test.js')

tap.test('GET /', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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

tap.test('GET /login', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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
            pathname: '/login',
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

tap.test('POST /login', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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

        get.post({
          url: url.format({
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/login',
            port: port
          }),
          form: {
            email: 'tohu@hey.com'
          }
        }, (err, res) => {
          t.ifErr(err)
          t.equal(res.statusCode, 202)

          server.close(cb)
        })
      })
    }
  ], (err) => {
    t.ifErr(err)
    t.end()
  })
})

tap.test('POST /login with empty email', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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

        get.post({
          url: url.format({
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/login',
            port: port
          }),
          form: {
            email: ''
          }
        }, (err, res) => {
          t.ifErr(err)
          t.equal(res.statusCode, 400)

          server.close(cb)
        })
      })
    }
  ], (err) => {
    t.ifErr(err)
    t.end()
  })
})

tap.test('POST /login with malformed email', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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

        get.post({
          url: url.format({
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/login',
            port: port
          }),
          form: {
            email: 'not-a-valid.email'
          }
        }, (err, res) => {
          t.ifErr(err)
          t.equal(res.statusCode, 422)

          server.close(cb)
        })
      })
    }
  ], (err) => {
    t.ifErr(err)
    t.end()
  })
})

tap.test('GET /home without a session should get 401', function (t) {
  process.env.LOGIN_JWT_SECRET = uuidv4()
  process.env.SESSION_JWT_SECRET = uuidv4()

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
            pathname: '/home',
            port: port
          })
        }, (err, res) => {
          t.ifErr(err)
          t.equal(res.statusCode, 401)

          server.close(cb)
        })
      })
    }
  ], (err) => {
    t.ifErr(err)
    t.end()
  })
})

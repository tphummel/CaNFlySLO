'use strict'

const waterfall = require('run-waterfall')
const tap = require('tap')

const dbTestUtils = require('./util/db-test.js')

tap.test('create user and getByEmail', (t) => {
  const dbfile = dbTestUtils.getFilename()
  process.env.DBFILE = dbfile

  const lib = require('./user')
  const inputEmail = 'test@test.com'

  waterfall([
    (cb) => { dbTestUtils.setup(dbfile, cb) },
    (stdout, stderr, cb) => { lib.user.create(inputEmail, cb) },
    (cb) => { lib.user.getByEmail(inputEmail, cb) }
  ], (err, userFromDb) => {
    t.ifErr(err)
    t.equal(inputEmail, userFromDb.email)
    t.end()
  })
})

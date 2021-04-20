'use strict'

const waterfall = require('run-waterfall')
const tap = require('tap')

const dbTestUtils = require('./util/db-test.js')

tap.test('create customer and getByEmail', (t) => {
  const dbfile = dbTestUtils.getFilename()
  process.env.DBFILE = dbfile

  const lib = require('./customer')
  const inputEmail = 'test@test.com'

  waterfall([
    (cb) => { dbTestUtils.setup(dbfile, cb) },
    (stdout, stderr, cb) => { lib.customer.create(inputEmail, cb) },
    (customer, cb) => {
      console.log('customer', customer)
      lib.customer.getByEmail(inputEmail, cb)
    }
  ], (err, customerFromDb) => {
    t.ifErr(err)
    console.log(customerFromDb)
    t.equal(inputEmail, customerFromDb.email)
    t.end()
  })
})

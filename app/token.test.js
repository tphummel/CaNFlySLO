'use strict'

const lib = require('./token')
const tap = require('tap')
const jwt = require('jsonwebtoken')

tap.test('createLoginToken', function (t) {
  const email = 'tohu@hey.com'

  process.env.LOGIN_JWT_SECRET = 'tokenUnitTest1'

  lib.createLoginToken({ email }, (err, token) => {
    t.ifErr(err)

    jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, payload) => {
      t.ifErr(err)
      t.ok(payload.exp > payload.iat, 'expires in the future')
      // t.ok(payload.exp - payload.iat < 1000 * 60 * 15, 'expires in the less than fifteen minutes')
      t.equal(payload.email, email)
      t.end()
    })
  })
})

tap.test('createSessionToken', function (t) {
  const email = 'tohu@hey.com'

  process.env.SESSION_JWT_SECRET = 'tokenUnitTest2'

  lib.createSessionToken({ email }, (err, token) => {
    t.ifErr(err)

    jwt.verify(token, process.env.SESSION_JWT_SECRET, (err, payload) => {
      t.ifErr(err)
      t.equal(payload.email, email)
      t.ok(payload.exp > payload.iat, 'expires in the future')
      // t.ok(payload.exp - payload.iat < 1000 * 60 * 60 * 36, 'expires in the less than 36 hours')
      t.end()
    })
  })
})

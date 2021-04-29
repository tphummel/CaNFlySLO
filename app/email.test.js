const lib = require('./email')
const tap = require('tap')

tap.test('send a stdout login email', function (t) {
  const email = 'tohu@hey.com'
  const token = 'a-jwt-token'

  // if this env var is falsy, it will go into stdout mode
  process.env.EMAIL_KEY = ''

  lib.sendLoginEmail({ customer: { email }, token }, (err) => {
    t.ifErr(err)
    t.end()
  })
})

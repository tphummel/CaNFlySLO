'use strict'

const path = require('path')
const os = require('os')
const cp = require('child_process')

const waterfall = require('run-waterfall')
const tap = require('tap')

function setup (dbfile, cb) {
  const cmd = `flyway -user= -password= -locations="filesystem:./sql" -url="jdbc:sqlite:${dbfile}" migrate`
  return cp.exec(cmd, {}, cb)
}

tap.test('create user and getByEmail', (t) => {
  const now = (new Date()).toISOString()
  const dbfile = path.join(os.tmpdir(), `${now}.sqlite3`)
  process.env.DBFILE = dbfile

  const lib = require('./user')
  const inputEmail = 'test@test.com'

  waterfall([
    (cb) => { setup(dbfile, cb) },
    (stdout, stderr, cb) => { lib.user.create(inputEmail, cb) },
    (cb) => { lib.user.getByEmail(inputEmail, cb) }
  ], (err, userFromDb) => {
    t.ifErr(err)
    t.equal(inputEmail, userFromDb.email)
    t.end()
  })
})

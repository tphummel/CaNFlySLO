'use strict'

const cp = require('child_process')
const path = require('path')
const os = require('os')

function getFilename () {
  const now = (new Date()).toISOString()
  const dbfile = path.join(os.tmpdir(), `${now}.sqlite3`)
  return dbfile
}

function setup (dbfile, cb) {
  const cmd = `flyway -user= -password= -locations="filesystem:./sql" -url="jdbc:sqlite:${dbfile}" migrate`
  return cp.exec(cmd, {}, cb)
}

module.exports = { setup, getFilename }

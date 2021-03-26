'use strict'

const sql = require('sqlite3')
const path = require('path')

const dbFile = process.env.DBFILE || path.join(__dirname, '..', 'tad.sqlite3')
const db = new sql.Database(dbFile)

module.exports = db

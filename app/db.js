'use strict'

const sql = require('sqlite3')
const path = require('path')

const dbFile = process.env.DBFILE || path.join(__dirname, '..', 'app.sqlite3')
const db = new sql.Database(dbFile)

module.exports = db

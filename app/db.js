'use strict'

const sql = require('sqlite3')
const path = require('path')

const dbFile = process.env.DBFILE || path.join(__dirname, '..', 'app.sqlite3')

// instantiation automatically opens the db. there is no separate connect() call
// https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback

const db = new sql.Database(dbFile, sql.OPEN_READWRITE | sql.OPEN_CREATE, (err) => {
  if (err) {
    console.error(`error opening the sqlite3 database: ${err}`)
    process.exit(1)
  } else {
    console.log('sqlite3 database opened successfully')

    // https://litestream.io/tips/
    // https://news.ycombinator.com/item?id=26103776
    // 64MB cache file size. yes -64000 is correct. negative.
    const pragmaQueries = `
  PRAGMA journal_mode=WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA cache_size = -64000;
  `

    db.run(pragmaQueries, [], (err) => {
      if (err) {
        console.error(`error running sqlite3 pragma queries at startup: ${err}`)
        process.exit(1)
      }
      console.log('sqlite3 startup pragma queries successful')
    })
  }
})

module.exports = db

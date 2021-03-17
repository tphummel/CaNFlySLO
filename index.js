const path = require('path')
const createServer = require('http-hash-server')
const formBody = require('body-parser').urlencoded({ extended: true })

const waterfall = require('run-waterfall')

const p8s = require('prom-client')
p8s.collectDefaultMetrics()

const sql = require('sqlite3')

var dbFile = process.env.DBFILE || path.join(__dirname, 'tad.sqlite3')
var db = new sql.Database(dbFile)

const user = {
  create: function (email, cb) {
    const sql = 'INSERT INTO user (email) VALUES (?)'

    const params = [
      email
    ]

    db.run(sql, params, cb)
  }
}

const userRoutes = {
  post: (req, res, opts) => {
    user.create(req.body.email, (err) => {
      if (err) {
        res.status(500).end(err)
      } else {
        res.status(201).end()
      }
    })
  }
}

const host = '127.0.0.1'
const port = 8081

const express = require('express')
const app = express()

app.post('/users', formBody, userRoutes.post)
app.get('/metrics', async (req, res, opts) => {
  try {
    res.setHeader('Content-Type', p8s.register.contentType)
    res.statusCode = 200
    res.end(await p8s.register.metrics(), 'utf8')
  } catch (ex) {
    res.statusCode = 500
    res.end(ex)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

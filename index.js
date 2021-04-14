'use strict'

const express = require('express')
const app = express()
app.use(require('body-parser').urlencoded({ extended: true }))

const { userRoutes } = require('./app/user')
app.post('/users', userRoutes.post)

const p8s = require('prom-client')
p8s.collectDefaultMetrics()
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

function start (app, port, cb) {
  return app.listen(port, cb)
}

function close (server, cb) {
  return server.close()
}

module.exports = {
  app: app,
  start: start,
  close: close
}

if (!module.parent) {
  const port = process.env.PORT || 8081
  start(app, port, (err) => {
    if (err) console.error(err) && process.exit(1)
    console.log(`listening on port ${port}`)
  })
}

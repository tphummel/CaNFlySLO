'use strict'

const port = 8081

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

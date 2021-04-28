'use strict'

if (process.env.NODE_ENV === 'dev') {
  process.env.LOGIN_JWT_SECRET = '123123'
  process.env.SESSION_JWT_SECRET = 'abcsdf'
} else {
  if (!process.env.LOGIN_JWT_SECRET || !process.env.SESSION_JWT_SECRET) {
    console.error(`NODE_ENV=${process.env.NODE_ENV}
      Environment Variables not set:
      LOGIN_JWT_SECRET=${process.env.LOGIN_JWT_SECRET}
      SESSION_JWT_SECRET=${process.env.SESSION_JWT_SECRET}
      Set both of those variables or the server cannot start`)
  }
}

const express = require('express')
const { v4: uuidv4 } = require('uuid')
const morgan = require('morgan')
const waterfall = require('run-waterfall')
const app = express()

app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('helmet')())
app.use(require('cookie-parser')())


const Token = require('./app/token')
const Customer = require('./app/customer').customer
const Email = require('./app/email')

// custom flash middlware: https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
app.use((req, res, next) => {
  // ensure flash is available to subsequent request then cleaned up
  if (req.cookies.flash) {
    res.locals.flash = req.cookies.flash
    res.clearCookie('flash')
  }
  return next()
})

app.use((req, res, next) => {
  res.setHeader('X-Request-Id', uuidv4())
  return next()
})

// hide request logging when running automated tests
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

app.get('/', (req, res) => {
  return res.status(200).send(`
${res.locals.flash
    ? `<p>${res.locals.flash.type}: ${res.locals.flash.message}</p>`
    : ''
}
<p>/</p>
<a href="/login">login</a>
`)
})

app.get('/login', (req, res) => {
  return res.status(200).send(`
${res.locals.flash
    ? `<p>${res.locals.flash.type}: ${res.locals.flash.message}</p>`
    : ''
}
<p>/login</p>
<form action="" method="post">
  <input type="text" name="email" />
  <input type="submit" value="login" />
</form>
    `)
})

app.get('/login/verify', Token.middlewares.loginToken, (req, res) => {
  Token.createSessionToken({ email: req.loginToken.email }, (err, token) => {
    if (err) return res.status(500).send(err)

    res.cookie('sessionPayload', token)
    res.set('Location', '/home')
    return res.status(307).send('')
  })
})

app.post('/login', (req, res) => {
  if (!req.body || !req.body.email) return res.status(400).send('email is required')

  const inputEmail = req.body.email
  const isValidEmail = /.+@.+\..+/.test(inputEmail)

  if (!isValidEmail) return res.status(422).send('email is malformed')

  waterfall([
    function findExistingCustomer (cb) {
      Customer.getByEmail(inputEmail, function (err, customer) {
        return cb(err, { customer })
      })
    },
    function createCustomerIfNotFound ({ customer }, cb) {
      if (customer) return setImmediate(cb, null, { customer })

      Customer.create(inputEmail, function (err, createdCustomer) {
        return cb(err, { customer: createdCustomer })
      })
    },
    function createLoginToken ({ customer }, cb) {
      Token.createLoginToken(customer, (err, token) => {
        return cb(err, { customer, token })
      })
    },
    function sendLoginEmailToCustomer ({ customer, token }, cb) {
      Email.sendLoginEmail({ customer, token }, (err) => {
        return cb(err, { customer })
      })
    }
  ], function (err, { customer }) {
    if (err) console.log('err on post /login ', err)

    if (err) return res.status(500).send(err)

    return res.status(202).send('login request received')
  })
})

app.get('/home', Token.middlewares.sessionToken, (req, res) => {
  return res.send(`
    ${res.locals.flash
  ? `<p>${res.locals.flash.type}: ${res.locals.flash.message}</p>`
  : ''
}
    <p>/home</p>
    <p>logged in as: ${req.customer.email}</p>
    <p><form method="post" action="/logout"><input type="submit" value="Logout" /></form></p>
  `)
})

app.post('/logout', Token.middlewares.sessionToken, (req, res) => {
  res.clearCookie('sessionPayload')
  res.cookie('flash', {
    type: 'success',
    message: 'logout successful'
  })
  res.set('location', '/login')
  return res.status(302).send('/logout')
})

const { customerRoutes } = require('./app/customer')
app.post('/customers', customerRoutes.post)

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

// this file is being used directly, not included as a module for testing
if (!module.parent) {
  const port = process.env.PORT || 8081
  start(app, port, (err) => {
    if (err) console.error(err) && process.exit(1)
    console.log(`listening on port ${port}`)
  })
}

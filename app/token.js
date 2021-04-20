'use strict'

const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

function createLoginToken ({ email }, cb) {
  return jwt.sign({
    email
  }, process.env.LOGIN_JWT_SECRET, {
    expiresIn: '10m',
    algorithm: 'HS256'
  }, cb)
}

function createSessionToken (customer, cb) {
  return jwt.sign(customer, process.env.SESSION_JWT_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256'
  }, cb)
}

const middlewares = {
  loginToken: expressJwt({
    secret: process.env.LOGIN_JWT_SECRET || 'login-token-secret',
    algorithms: ['HS256'],
    requestProperty: 'loginToken',
    credentialsRequired: true,
    getToken: (req) => {
      if (req.query) return req.query.token
      return null
    }
  }),
  sessionToken: expressJwt({
    secret: process.env.SESSION_JWT_SECRET || 'session-cookie-secret',
    algorithms: ['HS256'],
    credentialsRequired: true,
    getToken: (req) => {
      if (req.cookies) return req.cookies.sessionPayload
      return null
    }
  })
}

module.exports = {
  createLoginToken,
  createSessionToken,
  middlewares
}

'use strict'

const db = require('./db')

const user = {
  create: function (email, cb) {
    const sql = 'INSERT INTO user (email) VALUES (?)'
    db.run(sql, [email], cb)
  },
  getByEmail: function (email, cb) {
    const sql = 'SELECT * FROM user WHERE email = ?'
    db.get(sql, [email], cb)
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

module.exports = { user, userRoutes }

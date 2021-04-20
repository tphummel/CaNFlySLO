'use strict'

const db = require('./db')
const waterfall = require('run-waterfall')

const customer = {
  create: function (email, done) {
    waterfall([
      function beginTransaction (cb) {
        return db.exec('BEGIN TRANSACTION', cb)
      },
      function insertTenant (cb) {
        const tenantSql = 'INSERT INTO tenant (id) VALUES (NULL)'
        db.run(tenantSql, [], function onTenant (err) {
          return cb(err, this.lastID)
        })
      },
      function insertCustomer (tenantId, cb) {
        const customerSql = 'INSERT INTO customer (tenant_id, email) VALUES (?, ?)'
        db.run(customerSql, [tenantId, email], function onCust (err) {
          return cb(err, tenantId, this.lastID)
        })
      },
      function commitTransaction (tenantId, customerId, cb) {
        db.exec('COMMIT TRANSACTION', (err) => {
          return cb(err, { id: customerId, tenant_id: tenantId, email: email })
        })
      }
    ], done)
  },
  getByEmail: function (email, cb) {
    const sql = 'SELECT id, tenant_id, email FROM customer WHERE email = ?'
    db.get(sql, [email], cb)
  }
}

const customerRoutes = {
  post: (req, res, opts) => {
    customer.create(req.body.email, (err) => {
      if (err) {
        res.status(500).end()
      } else {
        res.status(201).end()
      }
    })
  }
}

module.exports = { customer, customerRoutes }

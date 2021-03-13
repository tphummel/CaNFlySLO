const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const p8s = require('prom-client')
p8s.collectDefaultMetrics()

const env = {
  database: 'customers',
  username: 'root',
  password: '12345',
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  storage: './customers.sqlite3',
  // storage: ':memory:',
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
})

sequelize.sync()

const Customer = sequelize.define('customer', {
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  }
})

app.post('/api/customers', (req, res) => {
  Customer.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age
  }).then(customer => {
    res.send(customer)
  })
})

app.get('/api/customers', (req, res) => {
  Customer.findAll().then(customers => {
    res.send(customers)
  })
})

app.get('/api/customers/:customerId', (req, res) => {
  Customer.findById(req.params.customerId).then(customer => {
    res.send(customer)
  })
})

app.put('/api/customers/:customerId', (req, res) => {
  const id = req.params.customerId
  Customer.update({ firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age },
    { where: { id: req.params.customerId } }
  ).then(() => {
    res.status(200).send('updated successfully a customer with id = ' + id)
  })
})

app.delete('/api/customers/:customerId', (req, res) => {
  const id = req.params.customerId
  Customer.destroy({
    where: { id: id }
  }).then(() => {
    res.status(200).send('deleted successfully a customer with id = ' + id)
  })
})

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', p8s.register.contentType)
    res.end(await p8s.register.metrics())
  } catch (ex) {
    res.status(500).end(ex)
  }
})

const server = app.listen(8081, function () {
  const host = server.address().address
  const port = server.address().port

  console.log('App listening at http://%s:%s', host, port)
})

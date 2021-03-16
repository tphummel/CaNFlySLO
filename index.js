const path = require('path')
const createServer = require('http-hash-server')
const formBody = require('body/form')

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
    waterfall([
      (cb) => {
        return formBody(req, cb)
      },
      (body, cb) => {
        console.log(body)
        // form data not actually decoding
        /*
        {
          '--------------------------73a4d03446b58264\r\nContent-Disposition: form-data; name': '"email"\r\n' +
            '\r\n' +
            'tphummel@gmail.com\r\n' +
            '--------------------------73a4d03446b58264--\r\n'
        }

        */
        // return user.create(body.email, cb)
        return user.create('tphummel@gmail.com', cb)
      }
    ], (err) => {
      if (err) {
        res.responseCode = 500
      } else {
        res.responseCode = 201
      }
      res.end()
    })
  }
}

const host = '127.0.0.1'
const port = 8081

const server = createServer({
  hostname: host,
  port: port,
  services: {
    user: {
      route: '/',
      methods: {
        create: {
          httpMethod: 'POST',
          route: '/user',
          handler: userRoutes.post
        }
      }
    },
    metrics: {
      route: '/',
      methods: {
        get: {
          httpMethod: 'GET',
          route: '/metrics',
          handler: async (req, res, opts) => {
            try {
              res.setHeader('Content-Type', p8s.register.contentType)
              res.statusCode = 200
              res.end(await p8s.register.metrics(), 'utf8')
            } catch (ex) {
              res.statusCode = 500
              res.end(ex)
            }
          }
        }
      }
    }
  }
})

server.listen((err) => {
  console.log('App listening at http://%s:%s', host, port)
})

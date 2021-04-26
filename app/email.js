'use strict'

function sendLoginEmail ({ customer, token }, cb) {
  const body = `
Click here to log in: https://cfs.local/login/verify?token=${token}
  `

  if (!process.env.EMAIL_KEY) {
    console.log(`
      mode: stdout
      email sent to: ${customer.email}
      body: ${body}
    `)
    return setImmediate(cb)
  } else {
    // send a real email
  }
}

module.exports = {
  sendLoginEmail
}

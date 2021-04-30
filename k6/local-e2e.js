import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'https://cfs.local'

export default () => {

  const root = http.get(`${BASE_URL}/`)
  check(root, {
    'is status 200': (r) => r.status === 200
  })

  const login = http.get(`${BASE_URL}/login`)
  check(login, {
    'is status 200': (r) => r.status === 200
  })

  const loginSubmit = http.post(`${BASE_URL}/login`, {email: 'tohu@hey.com'})
  check(loginSubmit, {
    'is status 202': (r) => r.status === 202
  })

  // test email tohu@hey.com
  // cribbed jwt signed with the dev credentials
  // no expiration on the token. normally these expire in 10 minutes.
  const loginToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvaHVAaGV5LmNvbSIsImlhdCI6MTYxOTc1NTM3NX0.w6e8rrcHKOsQf_RvvM_OURjxTuTWM-EKfCsr0LjFGbI'

  const verify = http.get(`${BASE_URL}/login/verify?token=${loginToken}`)
  check(verify, {
    'is status 200': (r) => r.status === 200
  })
}

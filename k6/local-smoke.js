import http from 'k6/http'
import { check, sleep } from 'k6'
export const options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(99)<1500'] // 99% of requests must complete below 1.5s
  }
}
const BASE_URL = 'https://cfs.local'

export default () => {
  const rootRes = http.get(`${BASE_URL}/`)
  check(rootRes, {
    'is status 200': (r) => r.status === 200
  })

  const metricsRes = http.get(`${BASE_URL}/metrics`)
  check(metricsRes, {
    'is status 200': (r) => r.status === 200
  })

  sleep(1)
}

import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
export let options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};
const BASE_URL = 'https://cfs.local';

export default () => {
  http.get(`${BASE_URL}/`);
  http.get(`${BASE_URL}/metrics`);
  http.get(`${BASE_URL}/`);
  sleep(1);
};

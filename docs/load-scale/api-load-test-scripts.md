# API Load Test Scripts

## Tools: k6 / Artillery

### Smoke Test (Baseline)
```javascript
// k6: api-smoke.js
import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "5m",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://api.remotedesk.io/health");
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });
}
```

### Load Test
```javascript
// k6: api-load.js
export const options = {
  stages: [
    { duration: "5m", target: 100 },
    { duration: "10m", target: 100 },
    { duration: "5m", target: 200 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  http.post("https://api.remotedesk.io/v1/auth/login", JSON.stringify({
    email: `user_${__VU}@test.com`,
    password: "TestPass123!",
  }), { headers: { "Content-Type": "application/json" } });
}
```

### Stress Test
```javascript
export const options = {
  stages: [
    { duration: "2m", target: 500 },
    { duration: "10m", target: 1000 },
    { duration: "2m", target: 2000 },
    { duration: "5m", target: 0 },
  ],
};
```

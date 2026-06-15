# RemoteDesk Testing Guide

## Test Types

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Integration Tests
```bash
# API tests
npm run test:api

# Database tests
npm run test:db

# WebSocket tests
npm run test:socket
```

### E2E Tests
```bash
# Web app
npm run test:e2e:web

# Desktop app
npm run test:e2e:desktop
```

## Writing Tests

### API Test Example
```typescript
import { describe, it, expect } from "vitest";

describe("POST /api/v1/auth/login", () => {
  it("should return token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "correct" });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("deskId");
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrong" });
    
    expect(res.status).toBe(401);
  });
});
```

### WebSocket Test Example
```typescript
import { io } from "socket.io-client";

describe("Signaling", () => {
  it("should join room with desk ID", (done) => {
    const socket = io("ws://localhost:4000/signaling", {
      auth: { token: testToken }
    });
    
    socket.emit("signaling:join", { deskId: "123456789" });
    
    socket.on("joined", ({ deskId }) => {
      expect(deskId).toBe("123456789");
      socket.disconnect();
      done();
    });
  });
});
```

## Test Data
```typescript
// test/fixtures/users.ts
export const testUsers = {
  admin: {
    id: "user_admin",
    email: "admin@test.com",
    role: "admin",
    password: "AdminPass123!"
  },
  regular: {
    id: "user_regular",
    email: "user@test.com",
    role: "user",
    password: "UserPass123!"
  }
};
```

## CI/CD
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
```

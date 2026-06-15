# Rate Limiting Configuration

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/v1/auth/login | 5 | 1 minute |
| /api/v1/auth/register | 3 | 1 hour |
| /api/v1/sessions | 100 | 1 minute |
| /socket.io/ | 20 | 1 minute |
| /api/v1/audit | 60 | 1 minute |

## Implementation
```typescript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1/auth/login", loginLimiter);
```

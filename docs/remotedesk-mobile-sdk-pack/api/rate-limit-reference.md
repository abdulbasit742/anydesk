# Rate Limit Reference

## Headers
- `X-RateLimit-Limit`: 100
- `X-RateLimit-Remaining`: 97
- `X-RateLimit-Reset`: 1718208000

## Limits
| Endpoint | Burst | Per Minute |
|----------|-------|------------|
| Auth | 5 | 10 |
| Devices | 20 | 60 |
| Sessions | 30 | 120 |
| Audit | 10 | 30 |

## SDK Handling
```typescript
import { parseRateLimitHeaders, waitForReset } from '@remotedesk/client-sdk';
```

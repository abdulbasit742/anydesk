# Pagination Reference

## Request
- `page`: 1-based integer
- `limit`: 1-100, default 20
- `cursor`: opaque string for cursor-based (future)

## Response
```json
{
  "data": [],
  "page": 1,
  "limit": 20,
  "total": 150,
  "hasMore": true,
  "nextCursor": "eyJpZCI6..."
}
```

## SDK Helper
```typescript
import { mergePaginated } from '@remotedesk/client-sdk';
const combined = mergePaginated(page1, page2);
```

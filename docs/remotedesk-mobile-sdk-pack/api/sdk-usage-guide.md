# SDK Usage Guide

## Installation
```bash
npm install @remotedesk/client-sdk
```

## Quick Start
```typescript
import { RemoteDeskAPI } from '@remotedesk/client-sdk';

const api = new RemoteDeskAPI({
  baseURL: 'https://api.remotedesk.io',
  apiVersion: 'v1',
  timeoutMs: 15000,
});

// Auth
const tokens = await api.auth.login({ email, password });
api.setAuthHeader(tokens.accessToken);

// Devices
const devices = await api.devices.list({ page: 1, limit: 20 });
```

## Error Handling
All methods throw `RemoteDeskSDKError`. Catch by code:
```typescript
try {
  await api.devices.get('unknown');
} catch (e) {
  if (e.code === 'not_found') { /* handle */ }
}
```

## Pagination
```typescript
let page = 1;
let hasMore = true;
while (hasMore) {
  const res = await api.audit.list({ page, limit: 50 });
  hasMore = res.hasMore;
  page++;
}
```

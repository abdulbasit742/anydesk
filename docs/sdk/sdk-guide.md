# RemoteDesk SDK Guide

## Installation
```bash
npm install @remotedesk/shared
```

## Quick Start
```typescript
import { RemoteDeskClient, AuthClient, DevicesClient } from "@remotedesk/shared";

const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io",
  apiKey: "your-api-key",
});

const auth = new AuthClient(client);
const devices = new DevicesClient(client);

// Login
const { data } = await auth.login({ email, password });

// List devices
const { data: deviceList } = await devices.list();
```

## Authentication
The SDK supports API key authentication:
```typescript
const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io",
  apiKey: process.env.REMOTEDESK_API_KEY,
});
```

## Error Handling
```typescript
import { RemoteDeskSDKError } from "@remotedesk/shared";

try {
  await devices.get("123456789");
} catch (err) {
  if (err instanceof RemoteDeskSDKError) {
    console.log(err.code); // "NOT_FOUND"
    console.log(err.message); // "Device not found"
  }
}
```

## Pagination
```typescript
const { data } = await devices.list({
  page: 1,
  limit: 20,
  sort: "createdAt",
  order: "desc",
});

console.log(data.items); // DeviceDTO[]
console.log(data.hasMore); // boolean
```

## Webhooks
```typescript
const webhooks = new WebhooksClient(client);

// Verify webhook signature
const isValid = await webhooks.verifySignature(payload, signature, secret);
```

## TypeScript
Full TypeScript support included. All types exported.

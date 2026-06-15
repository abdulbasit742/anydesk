# RemoteDesk SDK Documentation

## Installation
```bash
npm install @remotedesk/sdk
# or
yarn add @remotedesk/sdk
# or
pnpm add @remotedesk/sdk
```

## Quick Start
```typescript
import { RemoteDeskClient } from "@remotedesk/sdk";

const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io/v1",
  socketUrl: "wss://api.remotedesk.io/signaling",
});

// Login
const { token, deskId } = await client.login("user@example.com", "password");

// Connect to signaling
const socket = client.connect();

// Listen for events
socket.on("session:request", ({ viewerDeskId }) => {
  console.log(`Connection request from ${viewerDeskId}`);
});
```

## Configuration
| Option | Type | Required | Default |
|--------|------|----------|---------|
| apiUrl | string | Yes | - |
| socketUrl | string | Yes | - |
| timeout | number | No | 30000 |

## API Reference

### RemoteDeskClient

#### constructor(config: RemoteDeskConfig)
Creates a new client instance.

#### login(email: string, password: string): Promise<{ token: string; deskId: string }>
Authenticates and returns session credentials.

#### connect(): Socket
Connects to Socket.IO signaling server. Must call login() first.

#### disconnect(): void
Disconnects from signaling server.

#### getDeskId(): string | null
Returns current desk ID or null if not logged in.

#### isConnected(): boolean
Returns true if connected to signaling server.

## Error Handling
All SDK methods throw `RemoteDeskError` on failure.

```typescript
try {
  await client.login(email, password);
} catch (error) {
  if (error instanceof RemoteDeskError) {
    console.log(error.userMessage);  // User-friendly message
    console.log(error.code);         // Error code
    console.log(error.retryable);    // Can retry?
  }
}
```

## Examples
See `examples/` directory for complete working examples.

## License
MIT

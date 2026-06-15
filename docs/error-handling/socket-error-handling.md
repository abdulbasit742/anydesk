# Socket Error Handling

## Error Events
```typescript
// Server-emitted errors
socket.on("error", (error: SocketError) => {
  console.error("Socket error:", error.code, error.message);
});

// Connection errors
socket.on("connect_error", (error) => {
  if (error.message === "Authentication failed") {
    // Token expired, refresh and reconnect
    refreshToken().then(() => socket.connect());
  }
});

// Timeout for requests
const response = await socket.timeout(10000).emitWithAck("session:request", data);
```

## Error Types
| Event | Cause | Handling |
|-------|-------|----------|
| connect_error | Auth failure, server down | Log, notify user, retry |
| disconnect | Network, server restart | Auto-reconnect |
| error | Business logic error | Handle per error code |
| connect_timeout | Slow network | Retry with backoff |

## Reconnection Strategy
```typescript
const socket = io("wss://api.remotedesk.io", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_failed", () => {
  console.error("Failed to reconnect");
  // Show offline UI
});
```

## Graceful Degradation
- If WebSocket fails, try HTTP polling
- If real-time fails, show cached data
- If connection lost, queue actions and sync on reconnect

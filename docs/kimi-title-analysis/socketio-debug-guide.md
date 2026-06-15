# RemoteDesk: Socket.IO Debugging Guide

This guide provides instructions for debugging Socket.IO connections and events within the RemoteDesk application. Effective Socket.IO debugging is crucial for understanding signaling, real-time communication, and identifying issues related to connection, disconnection, and message exchange.

## 1. Enabling Debug Logs

Socket.IO, both client and server, uses the `debug` module for logging. You can enable verbose logging by setting the `DEBUG` environment variable.

### 1.1 Server-Side (API Service)

To enable all Socket.IO and Engine.IO debug logs on the server:

```bash
# In your terminal before starting the API service
DEBUG=socket.io:*,engine:* npm run dev # or yarn dev

# Or in your apps/api/.env file
DEBUG=socket.io:*,engine:*
```

**Granular Debugging**: You can specify more granular debug namespaces:

*   `socket.io:server`: Logs related to the Socket.IO server instance.
*   `socket.io:client`: Logs related to the Socket.IO client instance (if your API also acts as a client).
*   `engine:socket`: Low-level Engine.IO socket events (connection, disconnection, ping/pong).
*   `engine:parser`: Details about packet parsing.

### 1.2 Client-Side (Desktop Client)

To enable Socket.IO debug logs in the Electron renderer process:

1.  **Modify `package.json`**: Add the `DEBUG` environment variable to your desktop client's development script.

    ```json
    // apps/desktop/package.json
    {
      "scripts": {
        "dev": "cross-env DEBUG=socket.io:*,engine:* electron-vite dev"
      }
    }
    ```
    *Note: You might need `cross-env` package (`npm install -D cross-env`) for cross-platform compatibility.*

2.  **Launch and Check DevTools**: Launch the desktop client. The debug logs will appear in the Electron renderer process's Developer Tools console.

## 2. Monitoring Socket.IO Events

### 2.1 Server-Side Event Handlers

Ensure your server-side Socket.IO event handlers are correctly implemented and logging when events are received and emitted.

```typescript
// Example: apps/api/src/socket.ts
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("connect:request", (payload) => {
    console.log(`Received connect:request from ${socket.id}:`, payload);
    // ... logic
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  });
});
```

### 2.2 Client-Side Event Listeners

Verify that your client-side Socket.IO listeners are correctly set up to receive events from the server.

```typescript
// Example: apps/desktop/src/renderer/src/services/socket.ts
socket.on("connect", () => {
  console.log("Socket.IO client connected.");
});

socket.on("incoming:request", (payload) => {
  console.log("Received incoming:request:", payload);
  // ... logic
});

socket.on("disconnect", (reason) => {
  console.log(`Socket.IO client disconnected: ${reason}`);
});

socket.on("error", (error) => {
  console.error("Socket.IO error:", error);
});
```

## 3. Network Tab in Browser DevTools

In the Electron renderer process's DevTools, the **Network** tab is invaluable for inspecting WebSocket (Socket.IO) traffic.

1.  **Filter by WS**: In the Network tab, filter by `WS` (WebSockets) to see your Socket.IO connection.
2.  **Inspect Frames**: Click on the WebSocket connection and go to the **Messages** tab. You will see all incoming and outgoing Socket.IO frames.
    *   `0`: Connect packet.
    *   `40`: Connect packet with namespace.
    *   `42`: Event packet (contains the event name and data).
    *   `3`: Pong packet (response to server's ping).

    This allows you to verify that messages are being sent and received with the correct event names and payloads.

## 4. Common Socket.IO Issues and Debugging Steps

*   **Client not connecting**: 
    *   Check server logs for `socket.io:server` debug output. Is the server even receiving connection attempts?
    *   Check client logs for connection errors. Is the `SIGNALING_SERVER_URL` correct?
    *   Verify firewall rules on both client and server machines.
*   **Events not being received**: 
    *   Ensure event names match exactly on both client and server (case-sensitive).
    *   Check `DEBUG=socket.io:*` logs to see if the event is being emitted by the sender and received by the server/receiver.
    *   Verify the correct namespace is being used if your application uses namespaces.
*   **Frequent disconnections**: 
    *   Check `engine:socket` debug logs for ping/pong timeouts. This often indicates network instability or a server under heavy load.
    *   Look for server-side errors that might be causing the server to close connections.
*   **Payload issues**: 
    *   Use the Network tab's Messages view to inspect the raw data being sent. Ensure the data structure matches what the receiver expects.
    *   Check for serialization/deserialization errors.

---

**Author**: Manus AI
**Date**: June 12, 2026

# Backend Reliability: Socket Cleanup Guidelines

In a real-time application like RemoteDesk, managing WebSocket connections efficiently is crucial for system stability and resource management. Improperly handled or "leaked" sockets can lead to memory leaks, high CPU usage, and eventually service failure. This document outlines the guidelines for socket cleanup in the RemoteDesk signaling server.

## 1. Why Socket Cleanup is Important?

*   **Resource Management:** Each open socket consumes memory and system resources (e.g., file descriptors).
*   **Signaling Accuracy:** Ensuring that the signaling server has an accurate view of which users and devices are actually online.
*   **Preventing "Ghost" Sessions:** Cleaning up sockets when a user disconnects unexpectedly prevents sessions from remaining in a "pending" or "active" state incorrectly.
*   **System Stability:** Preventing resource exhaustion that can lead to crashes or performance degradation.

## 2. When to Clean Up Sockets

Sockets should be cleaned up in the following scenarios:

*   **Explicit Disconnect:** When a client intentionally closes the connection (e.g., user logs out, closes the app).
*   **Implicit Disconnect:** When the connection is lost unexpectedly (e.g., network failure, client crash, device sleep).
*   **Heartbeat Failure:** When a client fails to respond to a heartbeat (ping/pong) within a specified timeframe.
*   **Authentication Expiration:** When a user's authentication token expires.
*   **Session Termination:** When a remote desktop session is ended, the associated signaling sockets should be cleaned up if they are no longer needed.

## 3. Socket Cleanup Strategies

### 3.1. Handling `disconnect` Events

Listen for the `disconnect` event provided by the WebSocket library (e.g., Socket.IO).

```typescript
// signaling-server/src/index.ts

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
    cleanupSocket(socket);
  });
});

async function cleanupSocket(socket) {
  const userId = socket.data.userId;
  const deviceId = socket.data.deviceId;

  // 1. Update user/device status in the database/Redis
  await updateStatus(userId, deviceId, 'offline');

  // 2. Notify other interested parties (e.g., peers in an active session)
  notifyPeersOfDisconnect(socket);

  // 3. Clean up any associated session state in Redis
  await cleanupSessionState(socket.id);

  // 4. Leave any rooms the socket was in
  // (Socket.IO handles this automatically on disconnect)
}
```

### 3.2. Heartbeat (Ping/Pong)

Implement a heartbeat mechanism to detect silent disconnections.

*   **Server-Side Ping:** The server periodically sends a `ping` message to all connected clients.
*   **Client-Side Pong:** Clients respond with a `pong` message upon receiving a `ping`.
*   **Timeout Detection:** If the server doesn't receive a `pong` from a client within a certain window (e.g., 30 seconds), it considers the connection lost and initiates cleanup.

### 3.3. Session-Specific Cleanup

When a remote desktop session ends:

1.  Send a `session-ended` message to both the client and the host.
2.  The signaling server should then clean up any temporary state associated with that session ID in Redis.
3.  If the client and host are no longer needed for any other sessions, their signaling sockets can be closed.

### 3.4. Periodic Cleanup Tasks

Implement a background task to periodically scan for and clean up "orphaned" or stale data in the database or Redis (e.g., sessions that haven't seen activity in several hours).

## 4. Best Practices

*   **Idempotent Cleanup:** Ensure the `cleanupSocket` function can be safely called multiple times for the same socket without issues.
*   **Graceful Degradation:** If the database or Redis is temporarily unavailable, the signaling server should still attempt to close the socket and handle the disconnection as best as possible.
*   **Logging:** Log all disconnection events and the reason for the disconnect for troubleshooting and auditing.
*   **Monitoring:** Track the number of active connections and the rate of disconnections to identify potential issues.

## 5. Related Documents

*   `backend-reliability-retry-policy.md`
*   `backend-reliability-timeouts.md`
*   `audit-log-structure.md`
*   `data-channel-heartbeat.md` (for peer-to-peer heartbeat)

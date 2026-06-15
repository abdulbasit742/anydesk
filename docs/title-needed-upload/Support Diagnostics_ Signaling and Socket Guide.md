# Support Diagnostics: Signaling and Socket Guide

This guide provides instructions for collecting diagnostic information related to the RemoteDesk signaling server and WebSocket connections. This is crucial for troubleshooting connection establishment issues, sudden disconnections, and signaling delays.

## 1. Signaling Connection Status

*   **Signaling Server URL:** (e.g., `wss://signaling.remotedesk.com`).
*   **Connection State:** Is the socket currently `connected`, `connecting`, `disconnected`, or `reconnecting`?
*   **Transport Used:** (e.g., `websocket`, `polling`). WebSockets are preferred for performance.

## 2. Socket.IO Logs (Client-Side)

Enable debug logging for Socket.IO on the client (web or desktop) to see the detailed exchange of messages.

### 2.1. Web Client

In the browser console, run:
`localStorage.debug = 'socket.io-client:socket';`
Then refresh the page and capture the console logs.

### 2.2. Desktop Application

Set the `DEBUG` environment variable before launching the application:
`DEBUG=socket.io-client:socket` (macOS/Linux)
`set DEBUG=socket.io-client:socket` (Windows)

## 3. Signaling Message Trace

Collect a trace of the signaling messages exchanged during the problematic period. Key messages to look for:

*   **`join-room`:** When a client joins a session room.
*   **`offer` / `answer`:** The exchange of WebRTC SDP.
*   **`ice-candidate`:** The exchange of network candidates.
*   **`session-started` / `session-ended`:** Status updates from the server.
*   **`error`:** Any error messages sent by the signaling server.

## 4. Heartbeat and Latency

*   **Ping/Pong Latency:** If available, provide the latency of the Socket.IO heartbeats.
*   **Frequency of Disconnects:** How often does the socket disconnect? Is there a pattern?
*   **Disconnect Reason:** What reason is provided in the `disconnect` event (e.g., `io server disconnect`, `ping timeout`, `transport close`)?

## 5. Network and Firewall

*   **WebSocket Support:** Verify that the user's network and any proxies/firewalls support long-lived WebSocket connections.
*   **Port 443:** Ensure that outgoing traffic to port 443 on the signaling server is allowed.
*   **Load Balancer Issues:** If using a load balancer, verify that "sticky sessions" are enabled if using polling as a fallback.

## 6. Server-Side Logs (for Administrators)

If you have access to the signaling server logs:

1.  Search for logs related to the user's `user_id` or `socket.id`.
2.  Look for errors during connection, room joining, or message forwarding.
3.  Check for high CPU or memory usage on the signaling server.
4.  Monitor the number of concurrent connections and message throughput.

## 7. Related Documents

*   `support-diagnostics-guide.md`
*   `backend-reliability-socket-cleanup.md`
*   `webrtc-sdp-debugging.md`
*   `webrtc-ice-candidate-debugging.md`
*   `audit-log-structure.md`

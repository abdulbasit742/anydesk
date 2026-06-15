# Data Channel Reliability: Channel Reconnect Mechanism

This document outlines the strategy and implementation for reconnecting WebRTC Data Channels within RemoteDesk after a temporary disconnection. Robust reconnection logic is vital for maintaining session continuity and providing a seamless user experience during transient network issues.

## 1. Understanding Data Channel Disconnections

WebRTC Data Channels can become disconnected for various reasons:

*   **Network Interruption:** Temporary loss of internet connectivity on either peer.
*   **Peer Connection State Change:** The underlying `RTCPeerConnection` transitions to a `disconnected` or `failed` state.
*   **Application-Level Closure:** One peer explicitly closes the data channel or the peer connection.
*   **Heartbeat Timeout:** The heartbeat mechanism (as described in `data-channel-heartbeat.md`) detects a silent failure and triggers a disconnection.

When a data channel disconnects, any ongoing data transfers (like file transfers) are interrupted, and real-time communication ceases.

## 2. Reconnection Strategy

RemoteDesk employs an automatic reconnection strategy that attempts to re-establish the data channel and, if necessary, the entire `RTCPeerConnection`.

### 2.1. Monitoring Connection State

The `RTCPeerConnection` provides `iceConnectionState` and `connectionState` events that are crucial for monitoring the connection status.

*   **`iceConnectionState`:** Reflects the state of the ICE agent (gathering candidates, checking connectivity). Transitions to `disconnected` or `failed` indicate a problem.
*   **`connectionState`:** A more comprehensive state that combines ICE and DTLS transport states. Transitions to `disconnected` or `failed` are key triggers for reconnection attempts.

```typescript
// Conceptual: Monitoring Peer Connection State
peerConnection.oniceconnectionstatechange = () => {
  console.log("ICE connection state changed:", peerConnection.iceConnectionState);
  if (peerConnection.iceConnectionState === "disconnected") {
    // Start reconnection process
    attemptReconnect();
  }
};

peerConnection.onconnectionstatechange = () => {
  console.log("Connection state changed:", peerConnection.connectionState);
  if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
    // Start reconnection process
    attemptReconnect();
  }
};

// Data channel specific events
dataChannel.onclose = () => {
  console.log("Data channel closed.");
  // If underlying peer connection is still 'connected', try to re-open data channel
  if (peerConnection.connectionState === "connected") {
    reopenDataChannel();
  }
};
```

### 2.2. Reconnection Flow

1.  **Detect Disconnection:** When `peerConnection.connectionState` transitions to `disconnected` or `failed`, or a data channel closes unexpectedly.
2.  **Grace Period/Retry Logic:** Instead of immediately declaring failure, a grace period is initiated, and reconnection attempts are made with exponential backoff.
    *   **Attempt 1:** Immediately after disconnection.
    *   **Attempt 2:** After 1 second.
    *   **Attempt 3:** After 2 seconds.
    *   **Attempt 4:** After 4 seconds.
    *   ... up to a maximum number of attempts or a total timeout.
3.  **Signaling Server Involvement:** The signaling server (Socket.IO) plays a crucial role in coordinating reconnection.
    *   When a peer detects a disconnection, it informs the signaling server.
    *   The signaling server can then notify the other peer or facilitate a new ICE/SDP exchange.
    *   A new `RTCPeerConnection` might be created, or `restartIce()` might be called on the existing one.
4.  **Re-offer/Re-answer:** If the `RTCPeerConnection` needs to be re-established, a new SDP offer/answer exchange is performed via the signaling server.
5.  **Data Channel Re-creation:** Once the `RTCPeerConnection` is re-established, new data channels are created or existing ones are re-opened.
6.  **State Synchronization:** After reconnection, application-level state (e.g., file transfer progress, clipboard content) needs to be resynchronized.

### 2.3. `restartIce()`

For minor network glitches, `RTCPeerConnection.restartIce()` can be used to trigger a new ICE gathering process without tearing down the entire peer connection. This is often faster than a full re-negotiation.

```typescript
function attemptReconnect() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    console.log(`Attempting reconnection (attempt ${reconnectAttempts + 1})...`);
    // Option 1: restart ICE on existing connection
    peerConnection.restartIce();

    // Option 2: if restartIce fails or is not sufficient, create a new PeerConnection
    // This involves more complex state management and re-adding tracks/data channels.

    reconnectAttempts++;
    setTimeout(attemptReconnect, getExponentialBackoffDelay(reconnectAttempts));
  } else {
    console.error("Max reconnection attempts reached. Connection failed.");
    // Notify user, clean up resources
    notifyUserConnectionFailed();
  }
}
```

## 3. State Synchronization After Reconnect

*   **File Transfer:** If a file transfer was in progress, the `data-channel-chunk-retry.md` mechanism can be extended to resume from the last successfully acknowledged chunk.
*   **Clipboard:** The clipboard content might need to be re-synced after reconnection.
*   **Remote Input:** No specific state to sync, but the client needs to be ready to send new input events.

## 4. Testing Reconnection

*   **Simulate Network Drops:** Use network tools to temporarily disconnect and reconnect the network interface on one or both peers.
*   **Graceful Shutdown:** Test scenarios where one peer gracefully closes the application and then restarts.
*   **Abrupt Termination:** Test scenarios where one peer's application crashes or is forcibly terminated.
*   **Monitor Logs:** Observe application logs and `chrome://webrtc-internals` for connection state transitions and reconnection attempts.

## 5. Diagnostic Information

If issues related to connection drops or failed reconnections occur, gather the following:

1.  **Application Logs:** Detailed logs showing `iceConnectionState` and `connectionState` changes, reconnection attempts, and any errors.
2.  **WebRTC Internals Dump:** A dump from `chrome://webrtc-internals` from both peers, covering the period before, during, and after the disconnection.
3.  **Network Conditions:** Description of network environment (stability, type of interruption).

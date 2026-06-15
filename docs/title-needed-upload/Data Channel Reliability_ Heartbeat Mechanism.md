# Data Channel Reliability: Heartbeat Mechanism

This document describes the heartbeat mechanism implemented for WebRTC Data Channels within RemoteDesk. A heartbeat is a periodic signal sent between peers to confirm that the connection is still alive and responsive, even when no other data is being exchanged. This is crucial for detecting silent failures and maintaining session integrity.

## 1. Purpose of a Heartbeat

WebRTC Data Channels, while reliable for data transfer, do not inherently provide a mechanism to detect if the underlying peer connection has silently failed (e.g., due to a network partition where one side thinks the connection is still open while the other does not). A heartbeat mechanism serves several purposes:

*   **Liveness Detection:** Confirms that the remote peer is still connected and responsive.
*   **Idle Connection Management:** Prevents NAT/firewall timeouts for idle connections by periodically sending traffic.
*   **Early Disconnection Detection:** Allows for faster detection of connection drops than relying solely on the WebRTC `iceConnectionState` or `connectionState` which can sometimes be slow to update.
*   **Session Health Monitoring:** Provides a signal of the overall health of the data channel.

## 2. Implementation Strategy

### 2.1. Heartbeat Messages

Simple, lightweight messages are sent periodically over a dedicated or existing data channel.

```typescript
// packages/shared/protocols/heartbeatProtocol.ts (Conceptual)

interface HeartbeatMessage {
  type: 'HEARTBEAT';
  timestamp: number; // Timestamp from sender to measure RTT
}

interface HeartbeatAckMessage {
  type: 'HEARTBEAT_ACK';
  timestamp: number; // Original timestamp from the received heartbeat
  ackTimestamp: number; // Timestamp from receiver when ACK is sent
}
```

### 2.2. Sender Logic

1.  **Periodic Sending:** A timer is set to send a `HEARTBEAT` message every `HEARTBEAT_INTERVAL` (e.g., 5-10 seconds).
2.  **Timeout Monitoring:** For each sent heartbeat, a `HEARTBEAT_TIMEOUT` (e.g., 15-30 seconds) is started. If a corresponding `HEARTBEAT_ACK` is not received within this timeout, the connection is considered lost or unresponsive.
3.  **Retries:** Optionally, a few retries can be attempted before declaring the connection dead.

```typescript
// apps/api/src/services/sessionHeartbeat.ts (Conceptual)

const HEARTBEAT_INTERVAL = 5000; // 5 seconds
const HEARTBEAT_TIMEOUT = 15000; // 15 seconds

class SessionHeartbeat {
  private dataChannel: RTCDataChannel;
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private lastSentTimestamp: number = 0;

  constructor(dataChannel: RTCDataChannel) {
    this.dataChannel = dataChannel;
    this.dataChannel.onmessage = this.handleMessage.bind(this);
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
    this.sendHeartbeat(); // Send initial heartbeat immediately
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.intervalId = null;
    this.timeoutId = null;
  }

  private sendHeartbeat() {
    if (this.dataChannel.readyState === 'open') {
      this.lastSentTimestamp = Date.now();
      const message: HeartbeatMessage = { type: 'HEARTBEAT', timestamp: this.lastSentTimestamp };
      this.dataChannel.send(JSON.stringify(message));
      this.resetTimeout();
    }
  }

  private resetTimeout() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      console.warn('Heartbeat timeout: Connection considered unresponsive.');
      // Trigger connection closure or re-negotiation
      this.dataChannel.close();
    }, HEARTBEAT_TIMEOUT);
  }

  private handleMessage(event: MessageEvent) {
    const message = JSON.parse(event.data);
    if (message.type === 'HEARTBEAT') {
      // Respond with ACK
      const ackMessage: HeartbeatAckMessage = {
        type: 'HEARTBEAT_ACK',
        timestamp: message.timestamp,
        ackTimestamp: Date.now(),
      };
      this.dataChannel.send(JSON.stringify(ackMessage));
    } else if (message.type === 'HEARTBEAT_ACK') {
      if (message.timestamp === this.lastSentTimestamp) {
        // Received ACK for the last sent heartbeat
        this.resetTimeout(); // Reset timeout as connection is alive
        const rtt = Date.now() - message.timestamp;
        // console.log(`Heartbeat RTT: ${rtt}ms`);
      }
    }
  }
}
```

### 2.3. Receiver Logic

1.  **Listen for Heartbeats:** The receiver listens for incoming `HEARTBEAT` messages.
2.  **Send Acknowledgments:** Upon receiving a `HEARTBEAT` message, the receiver immediately sends back a `HEARTBEAT_ACK` message.
3.  **Timeout Monitoring (Optional):** The receiver can also monitor for incoming heartbeats. If no heartbeat is received for a prolonged period, it can also declare the connection unresponsive.

## 3. Data Channel Selection

*   **Dedicated Channel:** A separate, unreliable (or partially reliable) data channel can be created specifically for heartbeat messages to avoid interfering with other critical data streams.
*   **Existing Channel:** Heartbeats can also be sent over an existing reliable data channel (e.g., the control channel) if its traffic is low and the overhead is acceptable.

## 4. Configuration Parameters

*   **`HEARTBEAT_INTERVAL`:** How often a heartbeat message is sent. A shorter interval detects failures faster but increases network traffic. (e.g., 5-10 seconds).
*   **`HEARTBEAT_TIMEOUT`:** How long to wait for an ACK before considering the connection unresponsive. Should be `HEARTBEAT_INTERVAL * N` where N is the number of missed heartbeats tolerated (e.g., 3 * `HEARTBEAT_INTERVAL`).

## 5. Testing Heartbeat Mechanism

*   **Network Disconnection:** Simulate network disconnections (e.g., unplugging Ethernet, disabling Wi-Fi) and verify that the heartbeat mechanism correctly detects the failure and closes the connection within the `HEARTBEAT_TIMEOUT`.
*   **Idle Connections:** Test with idle connections to ensure heartbeats keep the connection alive and prevent NAT/firewall timeouts.
*   **Performance Impact:** Monitor CPU and network usage to ensure the heartbeat mechanism does not introduce significant overhead.

## 6. Diagnostic Information

If issues related to connection liveness or unexpected disconnections occur, gather the following:

1.  **Application Logs:** Logs showing heartbeat send/receive events, timeouts, and connection state changes.
2.  **WebRTC Internals Dump:** A dump from `chrome://webrtc-internals` from both peers, focusing on `iceConnectionState` and `connectionState` transitions.
3.  **Network Conditions:** Description of network environment (stability, NAT type).

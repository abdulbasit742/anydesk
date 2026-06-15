# Data Channel Reliability: Message Ordering

This document outlines the considerations and mechanisms for ensuring message ordering within RemoteDesk's WebRTC Data Channels. Maintaining message order is crucial for the integrity of various features like remote input, clipboard synchronization, and file transfer.

## 1. WebRTC Data Channels Overview

WebRTC Data Channels provide a way to send arbitrary data between peers. They are built on top of SCTP (Stream Control Transmission Protocol), which in turn runs over UDP. SCTP offers various reliability and ordering options.

## 2. Ordering Guarantees

By default, WebRTC Data Channels offer two main types of ordering guarantees:

*   **Ordered (Reliable):** Messages are guaranteed to arrive in the order they were sent, and retransmissions occur if packets are lost. This is suitable for data where order and delivery are critical (e.g., remote input events, file transfer chunks).
*   **Unordered (Unreliable):** Messages are not guaranteed to arrive in order, and lost packets are not retransmitted. This is suitable for data where timeliness is more important than absolute reliability or order (e.g., real-time game state updates, telemetry data).

RemoteDesk will primarily use **ordered and reliable** data channels for critical functionalities to ensure data integrity.

## 3. Implementation Strategy

### 3.1. Data Channel Configuration

When creating a `RTCDataChannel`, we explicitly configure it for ordered and reliable delivery.

```typescript
// Example: Creating an ordered and reliable data channel
const dataChannel = peerConnection.createDataChannel("remoteInput", {
  ordered: true,
  maxRetransmits: undefined, // Or a specific number for bounded reliability
});

// For file transfer, a separate channel might be used, also ordered and reliable
const fileTransferChannel = peerConnection.createDataChannel("fileTransfer", {
  ordered: true,
  maxRetransmits: undefined,
});
```

### 3.2. Message Sequencing

Even with ordered data channels, it's good practice to include a sequence number in messages for debugging and to detect potential issues, though the underlying SCTP layer handles the ordering.

```typescript
interface RemoteInputEvent {
  sequence: number;
  type: 'keyboard' | 'mouse';
  // ... other event data
}

let sequenceNumber = 0;

function sendInputEvent(event: Omit<RemoteInputEvent, 'sequence'>) {
  const message: RemoteInputEvent = { ...event, sequence: sequenceNumber++ };
  dataChannel.send(JSON.stringify(message));
}
```

### 3.3. Handling Out-of-Order Messages (for unordered channels)

If any unordered data channels are introduced in the future, the receiving end must be prepared to handle messages that arrive out of order. This typically involves buffering messages and reordering them based on a sequence number, or simply processing them as they arrive if order is not critical.

## 4. Features Relying on Message Ordering

*   **Remote Input:** Keyboard and mouse events must be processed in the exact order they occurred to ensure accurate control.
*   **Clipboard Synchronization:** Copy/paste operations rely on the integrity and order of data chunks.
*   **File Transfer:** File chunks must be reassembled in the correct order to reconstruct the original file.
*   **Chat Messages:** While less critical, chat messages are typically expected to appear in the order they were sent.

## 5. Testing Message Ordering

*   **Unit Tests:** Verify that the data channel creation correctly sets `ordered: true`.
*   **Integration Tests:** Simulate sending multiple messages rapidly and verify their arrival order on the receiving end.
*   **Network Emulation:** Introduce packet loss and reordering using network emulation tools to ensure the reliable data channel correctly retransmits and reorders messages.
*   **WebRTC Internals:** Monitor `chrome://webrtc-internals` to observe data channel statistics, including messages sent/received and any retransmissions.

## 6. Diagnostic Information

If issues related to message ordering are suspected, gather the following:

1.  **WebRTC Internals Dump:** A dump from `chrome://webrtc-internals` from both peers.
2.  **Application Logs:** Logs detailing data channel events and message processing.
3.  **Network Conditions:** Description of network environment (latency, packet loss).

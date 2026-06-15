# Data Channel Reliability: Backpressure Handling

This document details the strategy for handling backpressure on WebRTC Data Channels within RemoteDesk. Backpressure occurs when the sender is transmitting data faster than the network can carry it or the receiver can process it, leading to buffered data and potential memory exhaustion or connection drops.

## 1. Understanding Backpressure in WebRTC

WebRTC Data Channels have an internal buffer (`bufferedAmount`). When you call `dataChannel.send()`, the data is added to this buffer. The underlying SCTP protocol then attempts to transmit this data over the network.

If the network is slow or congested, or if the receiver is slow to process incoming messages, the `bufferedAmount` will increase. If it grows too large, it can cause issues:

*   **High Latency:** Buffered data takes longer to reach the receiver.
*   **Memory Exhaustion:** The browser or application may run out of memory if the buffer grows unbounded.
*   **Connection Closure:** The browser might close the data channel if the buffer exceeds a certain threshold (often browser-specific).

## 2. Monitoring `bufferedAmount`

The key to handling backpressure is monitoring the `bufferedAmount` property of the `RTCDataChannel` and the `bufferedamountlow` event.

```typescript
// Example: Monitoring bufferedAmount
const dataChannel = peerConnection.createDataChannel("fileTransfer");

// A threshold above which we consider the channel congested
const HIGH_WATER_MARK = 1024 * 1024; // 1 MB

// A threshold below which we consider the channel clear to send more
const LOW_WATER_MARK = 1024 * 256; // 256 KB

dataChannel.bufferedAmountLowThreshold = LOW_WATER_MARK;

function sendData(data: ArrayBuffer) {
  if (dataChannel.bufferedAmount > HIGH_WATER_MARK) {
    // Channel is congested, pause sending
    console.warn("Data channel congested. Pausing transmission.");
    pauseSending();
    return;
  }

  dataChannel.send(data);
}

dataChannel.addEventListener('bufferedamountlow', () => {
  // The buffer has drained below the low water mark, resume sending
  console.log("Data channel buffer drained. Resuming transmission.");
  resumeSending();
});
```

## 3. Backpressure Handling Strategies

### 3.1. Pause and Resume (File Transfer)

For bulk data transfer like files, the "pause and resume" strategy is the most effective.

1.  **Chunking:** The file is divided into chunks (see `data-channel-chunk-retry.md`).
2.  **Send Loop:** A loop sends chunks sequentially.
3.  **Check Buffer:** Before sending each chunk, check `dataChannel.bufferedAmount`.
4.  **Pause:** If `bufferedAmount` > `HIGH_WATER_MARK`, pause the send loop.
5.  **Resume:** Listen for the `bufferedamountlow` event. When it fires, resume the send loop.

### 3.2. Dropping Non-Critical Data (Telemetry/Stats)

For continuous streams of non-critical data (e.g., high-frequency telemetry or stats updates), it might be acceptable to drop messages if the channel is congested.

1.  **Check Buffer:** Before sending a telemetry update, check `dataChannel.bufferedAmount`.
2.  **Drop:** If `bufferedAmount` > `HIGH_WATER_MARK`, simply discard the update and do not send it. The next update will be sent when the buffer clears.

### 3.3. Adaptive Quality (Screen Sharing)

While screen sharing primarily uses `RTCRtpSender` (video tracks) which has built-in congestion control, if any related metadata is sent via data channels, its rate should be adapted based on backpressure.

## 4. Implementation Guidelines

*   **Set Appropriate Thresholds:** The `HIGH_WATER_MARK` and `LOW_WATER_MARK` should be tuned based on the expected network conditions and the type of data being sent. A high water mark of 1-2 MB is often a reasonable starting point for file transfers.
*   **Avoid Blocking the Main Thread:** The send loop and backpressure handling logic should not block the main UI thread. Use asynchronous operations or Web Workers if necessary.
*   **Handle Channel Closure:** Always handle the `close` and `error` events on the data channel, as severe backpressure can sometimes lead to unexpected closures.

## 5. Testing Backpressure Handling

*   **Network Throttling:** Use browser developer tools or OS-level network emulation to artificially restrict bandwidth.
*   **Large File Transfers:** Attempt to transfer very large files over the throttled connection.
*   **Monitor Buffer:** Log the `bufferedAmount` during the transfer to verify that the pause/resume logic is triggering correctly and preventing unbounded buffer growth.

## 6. Diagnostic Information

If backpressure issues are suspected (e.g., application crashes during large transfers, extreme latency), gather:

1.  **Application Logs:** Logs showing `bufferedAmount` values, pause/resume events, and any data channel errors.
2.  **Network Conditions:** Details about the network connection (bandwidth, latency).
3.  **Browser/OS Details:** Different browsers handle data channel buffers slightly differently.

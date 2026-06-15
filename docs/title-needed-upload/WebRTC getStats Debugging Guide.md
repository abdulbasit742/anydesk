# WebRTC getStats Debugging Guide

The `RTCPeerConnection.getStats()` API provides a wealth of real-time statistics about a WebRTC connection, including network performance, media quality, and connection states. This guide explains how to use these statistics for debugging and monitoring RemoteDesk sessions.

## 1. Overview of getStats

`getStats()` returns a `RTCStatsReport` object, which is a map of statistics objects, each identified by a unique ID. These objects contain various metrics categorized by their `type`. Key statistic types include:

*   **`candidate-pair`:** Information about the selected ICE candidate pair (latency, throughput, state).
*   **`inbound-rtp`:** Statistics for incoming media streams (packets received, bytes received, jitter, packet loss).
*   **`outbound-rtp`:** Statistics for outgoing media streams (packets sent, bytes sent, target bitrate).
*   **`remote-inbound-rtp`:** Statistics about the local outgoing stream as seen by the remote peer (round-trip time, packet loss).
*   **`remote-outbound-rtp`:** Statistics about the remote incoming stream as seen by the remote peer.
*   **`media-source`:** Information about the local media source (frame rate, resolution).
*   **`transport`:** Statistics for the underlying transport (DTLS state, bytes sent/received).

## 2. Key Metrics for Debugging

### 2.1. Network Performance

*   **`roundTripTime` (in `candidate-pair`):** The current round-trip time (RTT) for the selected candidate pair. High RTT indicates network latency.
*   **`availableOutgoingBitrate` (in `candidate-pair`):** The estimated bandwidth available for outgoing traffic. Low values can lead to poor video quality.
*   **`currentRoundTripTime` (in `remote-inbound-rtp`):** RTT as measured by the remote peer for the local outgoing stream.

### 2.2. Media Quality (Inbound)

*   **`packetsLost` (in `inbound-rtp`):** Total number of packets lost. High packet loss causes stuttering and artifacts.
*   **`jitter` (in `inbound-rtp`):** Variation in packet arrival time. High jitter can lead to audio/video desynchronization.
*   **`framesDecoded` and `framesDropped` (in `inbound-rtp` for video):** High `framesDropped` relative to `framesDecoded` indicates performance issues on the receiving end.
*   **`frameWidth` and `frameHeight` (in `inbound-rtp` for video):** The current resolution of the incoming video stream.

### 2.3. Media Quality (Outbound)

*   **`retransmittedPacketsSent` (in `outbound-rtp`):** Number of packets retransmitted due to loss.
*   **`targetBitrate` (in `outbound-rtp`):** The bitrate the encoder is aiming for.
*   **`framesEncoded` (in `outbound-rtp` for video):** The number of frames successfully encoded.
*   **`qualityLimitationReason` (in `outbound-rtp` for video):** Indicates if the video quality is being limited by `cpu`, `bandwidth`, or `other`.

## 3. How to Use getStats for Debugging

1.  **Periodic Sampling:** Call `getStats()` at regular intervals (e.g., every 1-5 seconds) during a session.
2.  **Calculate Deltas:** Many metrics are cumulative. Calculate the difference between consecutive samples to get the rate of change (e.g., packets lost per second, average bitrate).
3.  **Monitor Trends:** Look for trends in metrics over time. For example, a steady increase in packet loss or a sudden drop in available bitrate.
4.  **Correlate with User Experience:** Match observed issues (e.g., user reports "lag") with the corresponding statistics at that time.
5.  **Visualize Data:** Use tools like `chrome://webrtc-internals` or custom dashboards to visualize the statistics for easier analysis.

## 4. Example: Monitoring Packet Loss

```javascript
let previousStats = null;

async function monitorStats(peerConnection) {
  const stats = await peerConnection.getStats();
  stats.forEach(report => {
    if (report.type === 'inbound-rtp' && report.kind === 'video') {
      if (previousStats) {
        const prevReport = previousStats.get(report.id);
        if (prevReport) {
          const packetsLostDelta = report.packetsLost - prevReport.packetsLost;
          const packetsReceivedDelta = report.packetsReceived - prevReport.packetsReceived;
          const totalPackets = packetsLostDelta + packetsReceivedDelta;
          const lossRate = totalPackets > 0 ? (packetsLostDelta / totalPackets) * 100 : 0;
          
          console.log(`Video Packet Loss Rate: ${lossRate.toFixed(2)}%`);
          if (lossRate > 5) {
            console.warn("High packet loss detected!");
          }
        }
      }
    }
  });
  previousStats = stats;
}

// Call monitorStats periodically
setInterval(() => monitorStats(myPeerConnection), 2000);
```

## 5. Related Documents

*   `webrtc-sdp-debugging.md`
*   `webrtc-packet-loss-guide.md`
*   `webrtc-ice-candidate-debugging.md`
*   `support-diagnostics-guide.md`

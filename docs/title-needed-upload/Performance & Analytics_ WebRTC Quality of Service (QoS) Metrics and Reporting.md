# Performance & Analytics: WebRTC Quality of Service (QoS) Metrics and Reporting

This document details the specific Quality of Service (QoS) metrics to be collected and reported for WebRTC sessions within RemoteDesk. Monitoring these metrics is crucial for understanding the real-time user experience, diagnosing issues, and ensuring high-quality remote desktop interactions.

## 1. Overview

WebRTC QoS metrics provide insights into the performance and reliability of the media streams (video and audio) during a remote session. By collecting and analyzing these metrics, we can identify network issues, client-side performance bottlenecks, and overall session quality.

## 2. Key WebRTC QoS Metrics

These metrics are primarily obtained via the `RTCPeerConnection.getStats()` API on the client-side.

### 2.1. Network-Related Metrics

*   **Round Trip Time (RTT):** The time it takes for a packet to travel from the sender to the receiver and back. High RTT indicates network latency.
    *   `RTCIceCandidatePairStats.currentRoundTripTime`
*   **Packet Loss:** The percentage of packets that fail to reach their destination.
    *   `RTCOutboundRtpStreamStats.packetsLost` (sent side)
    *   `RTCInboundRtpStreamStats.packetsLost` (received side)
*   **Jitter:** Variation in packet arrival times. High jitter can lead to choppy audio/video.
    *   `RTCInboundRtpStreamStats.jitter`
*   **Bandwidth:**
    *   **Available Bandwidth:** Estimated available bandwidth for sending/receiving media.
        *   `RTCIceCandidatePairStats.availableOutgoingBitrate`
        *   `RTCIceCandidatePairStats.availableIncomingBitrate`
    *   **Bytes Sent/Received:** Total bytes transferred for media streams.
        *   `RTCOutboundRtpStreamStats.bytesSent`
        *   `RTCInboundRtpStreamStats.bytesReceived`
*   **Candidate Type:** Indicates if the connection is P2P (host, srflx) or relayed (relay).
    *   `RTCIceCandidatePairStats.localCandidateType`, `RTCIceCandidatePairStats.remoteCandidateType`
*   **TURN Server Usage:** Whether a TURN server is being used for relaying.
    *   Inferred from `candidateType` being `relay`.

### 2.2. Video-Related Metrics

*   **Frame Rate (FPS):**
    *   **Frames Sent:** `RTCOutboundRtpStreamStats.framesSent`
    *   **Frames Decoded:** `RTCInboundRtpStreamStats.framesDecoded`
    *   **Frames Dropped:** `RTCInboundRtpStreamStats.framesDropped` (on receiver due to network/rendering issues)
*   **Resolution:** Width and height of the video stream.
    *   `RTCOutboundRtpStreamStats.frameWidth`, `RTCOutboundRtpStreamStats.frameHeight`
    *   `RTCInboundRtpStreamStats.frameWidth`, `RTCInboundRtpStreamStats.frameHeight`
*   **Bitrate:** Video encoding bitrate.
    *   `RTCOutboundRtpStreamStats.bytesSent` (over time)
    *   `RTCInboundRtpStreamStats.bytesReceived` (over time)
*   **Encoding/Decoding Time:** Time spent on video processing.
    *   `RTCOutboundRtpStreamStats.totalEncodeTime`
    *   `RTCInboundRtpStreamStats.totalDecodeTime`

### 2.3. Audio-Related Metrics

*   **Audio Level:** Input and output audio levels.
    *   `RTCOutboundRtpStreamStats.audioLevel`
    *   `RTCInboundRtpStreamStats.audioLevel`
*   **Echo Cancellation:** Metrics related to echo cancellation performance (if implemented).
*   **Noise Suppression:** Metrics related to noise suppression performance (if implemented).

## 3. Reporting and Analysis

### 3.1. Data Collection

*   **Client-Side Collection:** Periodically (e.g., every 5-10 seconds) call `getStats()` on the `RTCPeerConnection`.
*   **Data Transmission:** Send aggregated and relevant `getStats()` data to the backend via a dedicated API endpoint or WebSocket channel.
*   **Backend Aggregation:** Store and process the collected metrics in a time-series database.

### 3.2. Dashboards and Visualization

*   **Real-time Dashboards:** Use Grafana or similar tools to visualize live QoS metrics for active sessions, allowing support teams to diagnose issues.
*   **Historical Reports:** Generate daily/weekly/monthly reports on average QoS metrics, identifying trends and regressions.
*   **User-Specific Reports:** Allow administrators to view QoS metrics for individual user sessions.

### 3.3. Alerting

*   Configure alerts for critical QoS degradations (e.g., sustained high packet loss, high RTT, low frame rate) to proactively notify operations teams.

## 4. Related Documents

*   `webrtc-getstats-debugging-guide.md`
*   `webrtc-performance-optimization.md`
*   `performance-monitoring-metrics.md`
*   `performance-logging-tracing.md`
*   `audit-log-monitoring-alerting.md`

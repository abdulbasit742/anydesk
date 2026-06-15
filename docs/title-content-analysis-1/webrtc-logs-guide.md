# RemoteDesk: WebRTC Logging and Debugging Guide

This guide details how to collect, analyze, and interpret WebRTC logs to troubleshoot connection issues, media quality problems, and signaling failures in RemoteDesk.

## 1. The Primary Tool: `chrome://webrtc-internals`

For any WebRTC application running in a Chromium-based browser (including Electron), `chrome://webrtc-internals` is the most powerful debugging tool available.

### 1.1 Accessing `webrtc-internals`

*   **In a standard browser (Viewer)**: Open a new tab and navigate to `chrome://webrtc-internals`.
*   **In Electron (Host/Viewer)**: Open the DevTools console for the renderer process and execute:
    ```javascript
    window.open('chrome://webrtc-internals');
    ```
    This will open a new window dedicated to WebRTC internals.

### 1.2 Key Sections to Analyze

When you open `webrtc-internals` during an active or attempted session, you will see a list of `RTCPeerConnection` instances. Click on the relevant one to expand its details.

#### 1.2.1 API Trace

This section logs every WebRTC API call made by the application (e.g., `createOffer`, `setLocalDescription`, `addIceCandidate`).
*   **What to look for**: Ensure the sequence of calls is correct (Offer -> SetLocal -> SetRemote -> Answer -> SetLocal -> SetRemote). Look for any API calls that throw errors or fail.

#### 1.2.2 Stats Graphs

These graphs provide real-time visualization of connection metrics.
*   **`bweforvideo` (Bandwidth Estimation)**: Shows estimated available bandwidth. Drops here indicate network congestion.
*   **`bytesSent` / `bytesReceived`**: Confirms data is actually flowing. Flat lines after connection indicate a problem.
*   **`packetsLost`**: High packet loss directly correlates with poor video/audio quality or connection drops.
*   **`framesDecoded` / `framesEncoded`**: Indicates if the media pipeline is functioning.

#### 1.2.3 ICE Candidate Grid

This is crucial for debugging connection establishment failures.
*   **What to look for**: The grid shows all local and remote candidates and the pairs formed between them.
*   **State**: Look for a pair with the state `succeeded`. If all pairs are `failed` or `waiting`, the connection cannot be established.
*   **Candidate Types**:
    *   `host`: Local IP address (works on LAN).
    *   `srflx` (Server Reflexive): Public IP address discovered via STUN.
    *   `relay`: Connection routed through a TURN server.
*   **Troubleshooting**: If only `host` candidates are present, STUN/TURN configuration is likely missing or incorrect. If `srflx` candidates fail, a TURN server (`relay`) is required due to strict NAT/firewalls.

### 1.3 Creating a Dump

For asynchronous debugging or sharing with support, you can create a dump of the `webrtc-internals` data.
1.  At the top of the `webrtc-internals` page, click **Create Dump**.
2.  Click **Download the PeerConnection updates and stats data**.
3.  This saves a JSON file containing all the trace and stats data, which can be analyzed later or imported into tools like [fippo/webrtc-dump-importer](https://fippo.github.io/webrtc-dump-importer/).

## 2. Application-Level Logging

While `webrtc-internals` provides low-level details, application-level logging is necessary to understand the context and signaling flow.

### 2.1 Signaling Logs (API Server)

Ensure your Socket.IO server logs all WebRTC signaling events (`webrtc:offer`, `webrtc:answer`, `webrtc:ice`).
*   **What to look for**: Verify that messages are received from one peer and successfully emitted to the other. Check for missing messages or incorrect routing.

### 2.2 Client-Side Logs (Renderer Console)

Add `console.log` statements in your WebRTC wrapper or component:
*   Log when `RTCPeerConnection` state changes (`iceconnectionstatechange`, `connectionstatechange`, `signalingstatechange`).
*   Log when ICE candidates are gathered and sent.
*   Log when remote descriptions are set.
*   Log data channel state changes (`onopen`, `onclose`, `onerror`).

```javascript
// Example Client-Side Logging
peerConnection.oniceconnectionstatechange = () => {
  console.log(`ICE Connection State changed to: ${peerConnection.iceConnectionState}`);
};

peerConnection.onsignalingstatechange = () => {
  console.log(`Signaling State changed to: ${peerConnection.signalingState}`);
};
```

## 3. Common WebRTC Issues and Log Signatures

*   **ICE Connection Failed**: `webrtc-internals` shows all candidate pairs failed. Application logs show `iceConnectionState` transitioning to `failed`. **Cause**: Network blocking, missing TURN server, or incorrect STUN/TURN credentials.
*   **One-Way Media**: `bytesSent` is increasing on one side, but `bytesReceived` is zero on the other. **Cause**: Often related to asymmetric routing or firewall issues blocking UDP traffic in one direction.
*   **Poor Quality/Stuttering**: High `packetsLost` or low `bweforvideo` in `webrtc-internals`. **Cause**: Network congestion, insufficient bandwidth, or high CPU usage on the encoding side.
*   **Signaling State Mismatch**: Application logs show errors when calling `setRemoteDescription`. **Cause**: Signaling messages arriving out of order (e.g., Answer arriving before Offer is fully processed) or glare conditions (both sides sending Offer simultaneously).

---

**Author**: Manus AI
**Date**: June 12, 2026

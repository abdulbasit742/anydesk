# Support Diagnostics: WebRTC Guide

This guide provides specialized instructions for collecting diagnostic information related to WebRTC connections in RemoteDesk. This is the most critical information for troubleshooting "cannot connect," "no video," "poor quality," and "lag" issues.

## 1. WebRTC Connection States

Provide the current states of the `RTCPeerConnection`:

*   **`connectionState`:** (e.g., `new`, `connecting`, `connected`, `disconnected`, `failed`, `closed`).
*   **`iceConnectionState`:** (e.g., `new`, `checking`, `connected`, `completed`, `failed`, `disconnected`, `closed`).
*   **`signalingState`:** (e.g., `stable`, `have-local-offer`, `have-remote-offer`).

## 2. ICE Candidate Information

Understanding how peers are trying to connect is vital.

*   **Selected Candidate Pair:** What is the local and remote candidate type for the active connection (e.g., `host`, `srflx`, `relay`)?
*   **Local Candidates:** List of all gathered local candidates (redact IP addresses if necessary, but keep the type and protocol).
*   **Remote Candidates:** List of all received remote candidates.
*   **STUN/TURN Servers:** Which STUN and TURN servers are being used? Are they reachable?

## 3. WebRTC Internals Dump (The "Gold Standard")

As mentioned in the Web and Desktop guides, a full WebRTC internals dump is essential.

*   **Chrome/Edge:** `chrome://webrtc-internals`
*   **Firefox:** `about:webrtc`
*   **Safari:** Use the "Web Inspector" and navigate to the "WebRTC" tab.

**Action:** Capture the dump during or immediately after a problematic session and provide the file.

## 4. Real-Time Statistics (getStats)

If possible, provide a snapshot of the `getStats()` output, focusing on:

*   **`roundTripTime`:** Network latency.
*   **`packetsLost`:** Packet loss for audio and video.
*   **`jitter`:** Variation in packet arrival.
*   **`frameWidth` / `frameHeight`:** Current video resolution.
*   **`availableOutgoingBitrate`:** Bandwidth estimation.
*   **`qualityLimitationReason`:** Is quality limited by `cpu` or `bandwidth`?

Refer to `webrtc-getstats-debugging-guide.md` for more details.

## 5. SDP Offer and Answer

The SDP exchange defines the media and security parameters.

*   **Capture SDP:** Log the full SDP offer and answer strings.
*   **Codec Negotiation:** Verify that both peers agree on a common codec (e.g., VP8, H.264, Opus).
*   **Directionality:** Ensure `a=sendrecv`, `a=sendonly`, or `a=recvonly` are set correctly for each stream.

Refer to `webrtc-sdp-debugging.md` for more details.

## 6. Media Stream Information

*   **Audio/Video Tracks:** Are the tracks `enabled` and in the `live` state?
*   **Capture Source:** What is being captured (e.g., entire screen, specific window, camera)?
*   **Permissions:** Have the necessary permissions been granted by the OS and browser?

## 7. Related Documents

*   `webrtc-getstats-debugging-guide.md`
*   `webrtc-sdp-debugging.md`
*   `webrtc-ice-candidate-debugging.md`
*   `webrtc-packet-loss-guide.md`
*   `webrtc-nat-failure-guide.md`
*   `webrtc-turn-failure-guide.md`
*   `support-diagnostics-guide.md`

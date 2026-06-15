# WebRTC SDP Debugging Notes

Session Description Protocol (SDP) is the mechanism used by WebRTC to negotiate media capabilities, security parameters, and network candidates between peers. Debugging SDP is crucial for resolving connection failures, media mismatches, and negotiation issues.

## 1. Understanding SDP Structure

An SDP description consists of several lines, each starting with a single character followed by an equals sign and a value (e.g., `v=0`, `o=- ...`, `m=video ...`). Key sections include:

*   **Session Level:** Information applicable to the entire session (e.g., `v`, `o`, `s`, `t`, `a=group:BUNDLE`).
*   **Media Level:** Information specific to a media stream (e.g., `m=audio`, `m=video`, `m=application`). Each media section contains:
    *   **Transport Information:** `c=IN IP4 ...`, `a=ice-ufrag`, `a=ice-pwd`, `a=fingerprint`.
    *   **Media Capabilities:** `a=rtpmap`, `a=fmtp`, `a=rtcp-fb`.
    *   **Directionality:** `a=sendrecv`, `a=sendonly`, `a=recvonly`, `a=inactive`.

## 2. Common SDP Issues and Debugging Steps

### 2.1. Media Mismatches

**Symptoms:** Connection establishes but no audio or video is received.

**Debugging:**
1.  Compare the `m=` lines in the offer and answer. Ensure both peers support at least one common codec for each media type.
2.  Check `a=rtpmap` lines for supported payload types and codec names (e.g., `VP8`, `H264`, `Opus`).
3.  Verify `a=fmtp` lines for specific codec parameters (e.g., `profile-level-id` for H.264).

### 2.2. Negotiation Failures

**Symptoms:** `setLocalDescription` or `setRemoteDescription` calls fail with an error.

**Debugging:**
1.  Inspect the error message provided by the browser. It often points to a specific line or parameter in the SDP.
2.  Check for invalid or malformed SDP syntax.
3.  Ensure the state machine of the `RTCPeerConnection` is in the correct state for the description being set (e.g., `stable` for an offer, `have-local-offer` for an answer).
4.  Verify that mandatory parameters like `ice-ufrag`, `ice-pwd`, and `fingerprint` are present.

### 2.3. ICE Candidate Issues in SDP

**Symptoms:** Connection fails during ICE gathering or connection establishment.

**Debugging:**
1.  Check if `a=candidate` lines are present in the SDP (if not using "trickle ICE").
2.  Verify the IP addresses and ports in the candidate lines are reachable.
3.  Ensure the `ice-ufrag` and `ice-pwd` in the SDP match those used by the ICE agent.

### 2.4. DTLS/Security Issues

**Symptoms:** Connection reaches `connected` state but media is not decrypted.

**Debugging:**
1.  Check `a=fingerprint` lines for correct hash algorithm and value.
2.  Ensure both peers agree on the DTLS role (`a=setup:actpass`, `a=setup:active`, `a=setup:passive`).
3.  Verify that the certificate used for DTLS is valid and its fingerprint matches the SDP.

## 3. Tools for SDP Debugging

*   **`chrome://webrtc-internals`:** Provides a detailed view of all SDP offers and answers exchanged during a session, along with any errors.
*   **WebRTC SDP Parser/Visualizer:** Online tools that can parse and visualize SDP strings, making them easier to read and analyze.
*   **Wireshark:** Can capture and analyze signaling traffic (if not encrypted) to see the SDP exchange.
*   **Browser Developer Console:** Log the SDP strings before calling `setLocalDescription` or `setRemoteDescription`.

## 4. Best Practices for SDP Handling

*   **Avoid Manual SDP Manipulation:** Whenever possible, let the browser generate and handle SDP. Manual modification is error-prone and should only be done when absolutely necessary (e.g., for specific codec preferences).
*   **Use Unified Plan:** Ensure both peers use the "unified-plan" SDP format, which is the modern standard and supports multiple media streams more effectively.
*   **Implement Robust Signaling:** Use a reliable signaling channel to ensure SDP messages are delivered correctly and in order.
*   **Log SDP for Debugging:** Always log the SDP offer and answer during development and in staging environments to facilitate troubleshooting.

## 5. Related Documents

*   `webrtc-ice-candidate-debugging.md`
*   `webrtc-nat-failure-guide.md`
*   `webrtc-turn-failure-guide.md`
*   `webrtc-getstats-debugging-guide.md`

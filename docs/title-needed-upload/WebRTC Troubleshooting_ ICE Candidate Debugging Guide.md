# WebRTC Troubleshooting: ICE Candidate Debugging Guide

This guide provides detailed information on understanding and debugging ICE (Interactive Connectivity Establishment) candidates in WebRTC connections within RemoteDesk. ICE is a framework that allows WebRTC to find the best possible communication path between two peers, often involving STUN (Session Traversal Utilities for NAT) and TURN (Traversal Using Relays around NAT) servers.

## 1. Understanding ICE Candidates

ICE candidates are potential network addresses and transport protocols that a WebRTC peer can use to communicate with another peer. There are several types of candidates:

*   **Host Candidates:** These are directly discovered from the local network interfaces of the device. They represent the device's actual IP address and port.
*   **Server Reflexive Candidates (STUN):** These are discovered by querying a STUN server. The STUN server tells the peer its public IP address and port as seen from the internet. This is crucial for peers behind NATs.
*   **Relay Candidates (TURN):** When direct peer-to-peer communication is not possible (e.g., due to restrictive NATs or firewalls), a TURN server acts as a relay. Relay candidates are the IP address and port of the TURN server that the peer can use to send and receive data.

During the ICE gathering process, each peer collects a list of these candidates and sends them to the other peer via the signaling channel. Both peers then try to establish connections using various combinations of these candidates until a working path is found.

## 2. Symptoms Indicating ICE Issues

*   **Connection Fails to Establish:** The most direct symptom. If ICE fails to find a suitable candidate pair, the WebRTC connection will not be established.
*   **Long Connection Times:** If ICE takes a long time to find a candidate pair, it might indicate that direct paths are failing, and it's falling back to less optimal (e.g., TURN) candidates.
*   **One-Way Audio/Video:** This can sometimes be an ICE issue where a path is established in one direction but not the other.
*   **Degraded Performance:** If only a suboptimal path (e.g., TURN relay) is found, performance might be worse than a direct peer-to-peer connection.

## 3. Debugging Tools

Modern web browsers provide excellent built-in tools for WebRTC debugging:

*   **`chrome://webrtc-internals` (for Chromium-based browsers like Chrome, Edge, Electron):** This is the most powerful tool. It provides a detailed view of all active WebRTC connections, including ICE candidate gathering, connection states, and statistics.
*   **`about:webrtc` (for Firefox):** Similar functionality to `webrtc-internals`.

For Electron desktop applications, `chrome://webrtc-internals` can usually be accessed by opening a new `BrowserWindow` and navigating to that URL, or by inspecting the renderer process.

## 4. How to Debug ICE Candidates using `chrome://webrtc-internals`

1.  **Open `chrome://webrtc-internals`:** In a new browser tab (or Electron debug window), navigate to `chrome://webrtc-internals`.
2.  **Initiate a RemoteDesk Session:** Start a connection attempt in RemoteDesk.
3.  **Observe the Report:** A new report entry will appear for the `RTCPeerConnection`. Expand it.
4.  **Focus on ICE Candidates and States:**
    *   **`iceGatheringState`:** Watch this state. It should transition from `new` to `gathering` and eventually to `complete`.
    *   **`iceConnectionState`:** This indicates the overall state of the ICE connection. It should go from `new` -> `checking` -> `connected` -> `completed`.
    *   **`localCandidates` and `remoteCandidates`:** These sections list all the candidates gathered by the local peer and received from the remote peer, respectively.
    *   **`candidatePair`:** This section shows the active candidate pairs being used or attempted. Look for the `state` of each pair (e.g., `waiting`, `in-progress`, `succeeded`, `failed`).

### Key Information to Look For:

*   **Candidate Types:** Identify if host, srflx (STUN), or relay (TURN) candidates are being gathered and exchanged. The `type` field in candidate details will show `host`, `srflx`, or `relay`.
*   **Candidate Addresses:** Check the IP addresses and ports of the candidates. Are they what you expect? Are public IPs being discovered correctly by STUN?
*   **`iceConnectionState` Stuck at `checking` or `failed`:** This indicates a problem. If it's stuck at `checking`, it means it's trying combinations but not succeeding. If it goes to `failed`, no suitable path was found.
*   **`candidatePair` Status:** Look for pairs with `state: succeeded`. If none, or only a few, are succeeding, it points to a connectivity issue.
*   **TURN Candidates:** If `relay` candidates are present but not succeeding, it might indicate a TURN server issue (refer to `webrtc-turn-failure-guide.md`). If `relay` candidates are not even being gathered, it might be a configuration issue or a very restrictive network blocking even TURN server access.

## 5. Common ICE Debugging Scenarios

### Scenario 1: No Candidates Gathered

*   **Problem:** `localCandidates` list is empty or very sparse.
*   **Possible Causes:** Network interface issues, firewall blocking all outbound connections, STUN/TURN server misconfiguration (if they are not even being contacted).
*   **Action:** Check network connectivity, firewall rules, and STUN/TURN server configuration in RemoteDesk.

### Scenario 2: `iceConnectionState` Stuck at `checking`

*   **Problem:** Candidates are being exchanged, but no pair is succeeding.
*   **Possible Causes:** Restrictive NATs, firewalls blocking specific ports or protocols, incorrect network routing, or issues with the STUN/TURN servers preventing successful address discovery/relay.
*   **Action:** Review `webrtc-nat-failure-guide.md` and `webrtc-turn-failure-guide.md`. Check firewall logs on both ends.

### Scenario 3: Only Relay Candidates Succeed

*   **Problem:** Direct (host/srflx) candidate pairs fail, and the connection falls back to TURN.
*   **Possible Causes:** Symmetric NATs, strict firewalls preventing direct UDP connections.
*   **Action:** This might be expected behavior in some network environments. If performance is an issue, investigate network configuration for less restrictive NAT types or firewall rules.

## 6. Diagnostic Information for Support

When reporting ICE issues to support, always include:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of the connection attempt.
3.  **`chrome://webrtc-internals` Dump:** Save the full `webrtc-internals` dump (usually a JSON file) from both the client and host devices immediately after the connection attempt fails or gets stuck. This is invaluable for diagnosis.
4.  **Network Environment:** Details about the network on both ends (e.g., home Wi-Fi, corporate network, VPN, firewall presence).

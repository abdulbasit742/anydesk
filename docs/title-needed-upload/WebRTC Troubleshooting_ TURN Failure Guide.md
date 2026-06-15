# WebRTC Troubleshooting: TURN Failure Guide

This guide provides information and troubleshooting steps for issues related to Traversal Using Relays around NAT (TURN) server failures in RemoteDesk WebRTC connections. TURN servers are crucial for establishing connections when direct peer-to-peer communication is not possible due to restrictive Network Address Translation (NAT) or firewall configurations.

## 1. Understanding TURN Servers

**TURN (Traversal Using Relays around NAT)** servers act as a relay for media traffic when STUN (Session Traversal Utilities for NAT) fails to establish a direct peer-to-peer connection. Instead of a direct connection, both peers connect to the TURN server, and the server relays all traffic between them. This ensures connectivity even in the most restrictive network environments.

## 2. Symptoms of TURN Failure

*   **Connection Fails to Establish:** If a direct (P2P) connection cannot be made and the TURN server is also unreachable or misconfigured, the WebRTC connection will fail entirely.
*   **High Latency and Packet Loss:** While TURN is designed to ensure connectivity, a poorly performing or overloaded TURN server can introduce significant latency and packet loss, leading to a degraded user experience (choppy video, delayed audio).
*   **One-Way Audio/Video:** In some cases, a partial TURN failure might result in one peer being able to send data to the TURN server, but the other peer not being able to receive it, or vice-versa.
*   **Error Messages:** Specific error messages related to ICE (Interactive Connectivity Establishment) negotiation failing, often indicating a lack of suitable candidates or a failure to allocate resources on the TURN server.

## 3. Common Causes of TURN Failure

*   **TURN Server Unreachable:** The client or host device cannot reach the TURN server due to network issues, incorrect server address, or firewall blocks.
*   **Incorrect TURN Server Configuration:** The TURN server itself might be misconfigured (e.g., incorrect credentials, wrong ports, insufficient bandwidth).
*   **Firewall Blocking TURN Ports:** Firewalls on either the client or host network might be blocking the necessary ports for TURN communication (typically UDP/TCP 3478, and a range of UDP ports for media).
*   **Expired/Invalid Credentials:** TURN servers often require authentication. If the credentials (username/password) are incorrect or expired, the server will reject connection requests.
*   **Overloaded TURN Server:** If the TURN server is handling too many connections or has insufficient resources, it may fail to allocate new relays or perform poorly.
*   **Network Restrictions:** Corporate networks or public Wi-Fi can have strict outbound filtering that prevents connections to non-standard ports or protocols, even for TURN.

## 4. Troubleshooting Steps

### 4.1. Verify TURN Server Reachability

*   **Ping/Traceroute:** From both the client and host networks, try to ping or traceroute the TURN server IP address or hostname to check basic network connectivity.
*   **`turnutils_stunclient` / `turnutils_test`:** If you have access to the `coturn` server utilities, you can use `turnutils_stunclient` or `turnutils_test` to verify the TURN server is functioning correctly and reachable from various network types.

### 4.2. Check Firewall Settings

*   **Client/Host Firewalls:** Ensure that local firewalls (Windows Defender, macOS Firewall, iptables on Linux) are not blocking outbound connections to the TURN server IP and ports (UDP/TCP 3478, and media ports).
*   **Network Firewalls:** If behind a corporate or managed network, consult with network administrators to ensure that outbound UDP/TCP traffic on port 3478 and a range of UDP ports (e.g., 49152-65535) is allowed to the TURN server.

### 4.3. Review TURN Server Configuration

*   **RemoteDesk Application:** Verify that the TURN server URLs and credentials configured within the RemoteDesk application are correct and match the actual TURN server settings.
*   **TURN Server (e.g., Coturn):** If self-hosting a TURN server, double-check its configuration file (`coturn.conf` for Coturn) for:
    *   `listening-port`, `tls-listening-port` (typically 3478)
    *   `min-port`, `max-port` (for media relay)
    *   `realm` and `user` settings (for authentication)
    *   `external-ip` (if behind NAT itself)
    *   Ensure the TURN server is running and accessible.

### 4.4. Check Credentials

*   **Authentication:** Confirm that the username and password used by RemoteDesk to authenticate with the TURN server are correct and have not expired. TURN server credentials often have a limited lifespan.

### 4.5. Monitor TURN Server Load

*   **Resource Usage:** If you manage the TURN server, monitor its CPU, memory, and network bandwidth usage. An overloaded server can lead to performance degradation or connection failures.
*   **Logs:** Check the TURN server logs for any errors, rejected connections, or resource allocation failures.

### 4.6. WebRTC Logs

*   **ICE Candidate Debugging:** Enable detailed WebRTC logging within the RemoteDesk application to inspect the ICE candidates gathered and the negotiation process. Look for `srflx` (STUN-derived) and `relay` (TURN-derived) candidates. Failures to gather `relay` candidates indicate a TURN issue (see `ice-candidate-debugging.md`).

## 5. Diagnostic Information for Support

If TURN server issues persist, please provide the following information to support:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of failed connection attempts.
3.  **Network Environment:** Detailed description of the network setup on both ends (e.g., corporate network, public Wi-Fi, VPN usage, firewall details).
4.  **TURN Server Details:** The TURN server URL(s) being used.
5.  **Error Messages:** Any specific error codes or messages displayed in the application or browser console.
6.  **WebRTC Logs:** Relevant sections of the WebRTC logs from both devices, focusing on ICE candidate gathering and connection state changes, specifically looking for TURN-related failures.
7.  **Coturn Server Logs (if self-hosting):** Relevant log snippets from your TURN server if you manage it.

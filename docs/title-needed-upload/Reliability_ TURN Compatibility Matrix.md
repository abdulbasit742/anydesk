# Reliability: TURN Compatibility Matrix

This document outlines the compatibility and performance expectations for RemoteDesk when utilizing various TURN (Traversal Using Relays around NAT) server configurations and providers. TURN servers are critical for establishing WebRTC connections in restrictive network environments where direct peer-to-peer communication is not possible.

## 1. Overview of TURN Server Usage

RemoteDesk leverages TURN servers as a fallback mechanism for WebRTC connections. When STUN (Session Traversal Utilities for NAT) fails to provide a public IP address or when NAT types are too restrictive (e.g., Symmetric NAT), both the client and host devices connect to a TURN server, which then relays all media and data traffic between them. This ensures connectivity but can introduce additional latency and bandwidth consumption.

## 2. Supported TURN Server Configurations

RemoteDesk is designed to be compatible with standard TURN server implementations that adhere to RFC 5766. We primarily test against and recommend the following:

| TURN Server Implementation | Version/Provider | Protocol Support | Authentication | Notes |
| :----------------------- | :--------------- | :--------------- | :------------- | :---- |
| **Coturn** | Latest stable | UDP, TCP, TLS/DTLS | Long-term credential, Static secret | Recommended for self-hosting due to robustness and feature set. |
| **Xirsys** | Cloud Service | UDP, TCP, TLS/DTLS | STUN/TURN credentials | Managed service, good for global distribution. |
| **Twilio Programmable Video** | Cloud Service | UDP, TCP, TLS/DTLS | API Key based | Integrated with Twilio ecosystem, reliable. |

## 3. Performance Considerations

*   **Latency:** All traffic relayed through a TURN server will incur additional latency compared to a direct peer-to-peer connection. The geographical distance to the TURN server significantly impacts this. We recommend deploying TURN servers geographically close to your user base.
*   **Bandwidth:** TURN servers consume significant bandwidth as they relay all media traffic. Ensure your TURN server infrastructure or cloud provider can handle the expected load. Refer to `cost-capacity-turn-bandwidth-calculator.md` for estimations.
*   **CPU/Memory:** TURN servers, especially when handling many concurrent connections, require adequate CPU and memory resources for efficient packet forwarding and encryption/decryption (for TLS/DTLS).
*   **Network Throughput:** The network interface of the TURN server must have sufficient throughput to handle the aggregate bandwidth of all relayed connections.

## 4. Common Issues and Troubleshooting

*   **TURN Server Unreachable:** This is often due to firewall rules blocking UDP/TCP port 3478 or other media ports. Refer to `webrtc-turn-failure-guide.md`.
*   **Authentication Failures:** Incorrect or expired TURN credentials. Ensure the credentials provided to RemoteDesk are valid and up-to-date.
*   **Poor Performance:** High latency or packet loss when using TURN usually indicates an overloaded TURN server, network congestion to the TURN server, or a geographically distant server.
*   **Relay Allocation Failure:** The TURN server might be unable to allocate a relay port, possibly due to resource exhaustion or misconfiguration.

## 5. Configuration Best Practices

*   **Multiple TURN Servers:** Configure RemoteDesk to use multiple TURN servers, ideally geographically distributed, to provide redundancy and reduce latency for users in different regions.
*   **TLS/DTLS for Security:** Always use TURN over TLS (TCP 443) or DTLS (UDP 443) for encrypted communication, especially when relaying sensitive data.
*   **Dynamic Credentials:** Implement dynamic generation of TURN credentials with short lifespans to enhance security.
*   **Monitoring:** Continuously monitor TURN server health, load, and performance metrics (CPU, memory, network I/O, active relays) to proactively identify and address issues.

## 6. Diagnostic Information for Support

When reporting TURN-related issues, please provide:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of the connection attempt.
3.  **TURN Server Details:** The specific TURN server(s) being used (IP/hostname, port, protocol).
4.  **Network Environment:** Description of the network on both ends (e.g., corporate network, public Wi-Fi, VPN usage, firewall details).
5.  **Error Messages:** Any specific error codes or messages displayed in the application or browser console.
6.  **WebRTC Logs:** Relevant sections of `chrome://webrtc-internals` dump, focusing on `relay` candidates and TURN server interactions (see `webrtc-ice-candidate-debugging.md`).
7.  **TURN Server Logs (if self-hosting):** Relevant log snippets from your TURN server, if accessible.

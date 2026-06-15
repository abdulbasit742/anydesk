# Reliability: Network Compatibility Matrix

This document outlines the network compatibility considerations for RemoteDesk, detailing how the application performs across various network types and configurations. Understanding network requirements and potential issues is critical for ensuring reliable remote access.

## 1. Network Types and Expected Performance

RemoteDesk is designed to work across a wide range of network environments, leveraging WebRTC for peer-to-peer connections and TURN servers for relaying when direct connections are not possible.

| Network Type | Description | Expected Performance | Common Issues & Notes |
| :----------- | :---------- | :------------------- | :-------------------- |
| **Home Network (Fiber/Cable)** | Typically provides good bandwidth and less restrictive NAT. | Excellent (low latency, high quality) | Occasional Wi-Fi instability, local network congestion. |
| **Home Network (DSL/Satellite)** | Lower bandwidth, potentially higher latency. | Good to Moderate (quality may adapt) | Bandwidth limitations, higher latency. |
| **Corporate Network** | Often features strict firewalls, proxies, and managed NATs. | Moderate to Good (may require IT configuration) | Firewall blocking, proxy interference, VPN overhead. May require IT to whitelist TURN servers. |
| **Public Wi-Fi (Cafes, Airports)** | Unstable, shared bandwidth, very restrictive NAT/firewalls. | Poor to Moderate (frequent quality drops, disconnections) | High latency, packet loss, bandwidth contention, strict firewalls. TURN server reliance is high. |
| **Mobile Data (4G/5G)** | Variable bandwidth and latency, often with Carrier-Grade NAT (CGNAT). | Moderate to Good (quality adapts to signal) | Signal strength variability, CGNAT can make P2P difficult, data caps. |
| **VPN Connection** | Encrypted tunnel, adds overhead and can change network characteristics. | Performance depends on VPN server location and quality. | Increased latency, reduced bandwidth, potential conflicts with WebRTC. |

## 2. Network Requirements

For optimal performance, RemoteDesk requires:

*   **Bandwidth:**
    *   **Minimum:** 5 Mbps (upload and download) for basic screen sharing and remote input.
    *   **Recommended:** 20+ Mbps (upload and download) for high-quality video, low latency, and file transfers.
*   **Latency:** Ideally below 100ms for a responsive experience. Higher latency will introduce noticeable delays.
*   **Packet Loss:** Should be minimal (ideally <1%). High packet loss severely degrades real-time communication quality.
*   **Ports:**
    *   **Outbound UDP/TCP 3478:** For STUN/TURN server communication.
    *   **Outbound UDP (Ephemeral Ports):** A range of high-numbered UDP ports (e.g., 1024-65535) for WebRTC media traffic. These are typically allowed by default.
    *   **Outbound TCP 443 (HTTPS):** For signaling and API communication.

## 3. Common Network-Related Issues and Troubleshooting

*   **Connection Failure:** Often due to restrictive NAT or firewall blocking WebRTC traffic. Refer to `webrtc-nat-failure-guide.md` and `webrtc-turn-failure-guide.md`.
*   **Laggy/Choppy Video:** Insufficient bandwidth, high latency, or packet loss. Advise users to check their internet speed and stability.
*   **One-Way Audio/Video:** Can indicate a partial network blockage where one peer can send but not receive data. Debug using `webrtc-ice-candidate-debugging.md`.
*   **Frequent Disconnections:** Unstable network connection, aggressive network security settings, or VPN instability.

## 4. VPN Considerations

Using RemoteDesk over a VPN can introduce additional complexity:

*   **Increased Latency:** VPNs add an extra hop and encryption overhead, which can increase latency.
*   **Reduced Bandwidth:** VPN encryption and server load can reduce available bandwidth.
*   **WebRTC Leakage:** Some VPNs may not properly route all WebRTC traffic, potentially exposing the user's real IP address. RemoteDesk aims to prevent this by routing all traffic through the established WebRTC connection.
*   **Split Tunneling:** If the VPN uses split tunneling, ensure that RemoteDesk traffic is routed through the VPN to maintain security and avoid network conflicts.

## 5. Diagnostic Information for Support

When reporting network-related issues, please provide:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of the issue.
3.  **Network Type:** Description of the network on both ends (e.g., home fiber, corporate VPN, mobile hotspot).
4.  **Internet Speed Test Results:** Upload, download speeds, and ping from both client and host.
5.  **Firewall/Antivirus Status:** Whether they are active and if RemoteDesk is whitelisted.
6.  **VPN Usage:** If a VPN is in use, specify the VPN provider and configuration.
7.  **WebRTC Logs:** Relevant sections of `chrome://webrtc-internals` dump (see `webrtc-ice-candidate-debugging.md`).

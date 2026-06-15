# WebRTC Troubleshooting: NAT Failure Guide

This guide provides information and troubleshooting steps for issues related to Network Address Translation (NAT) traversal failures in RemoteDesk WebRTC connections. NAT traversal is a critical component for establishing peer-to-peer connections between devices, especially when they are behind different types of routers or firewalls.

## 1. Understanding NAT and WebRTC

**Network Address Translation (NAT)** is a method of remapping one IP address space into another by modifying network address information in the IP header of packets while they are in transit across a traffic routing device. This allows multiple devices on a private network to share a single public IP address.

**WebRTC (Web Real-Time Communication)** uses various techniques to establish direct peer-to-peer connections, including:

*   **STUN (Session Traversal Utilities for NAT):** Used to discover the public IP address and port of a device behind a NAT.
*   **TURN (Traversal Using Relays around NAT):** Used when STUN fails, acting as a relay server to forward media traffic between peers.
*   **ICE (Interactive Connectivity Establishment):** A framework that combines STUN and TURN to find the best possible communication path between two peers.

## 2. Symptoms of NAT Failure

*   **Connection Fails to Establish:** The most common symptom. RemoteDesk attempts to connect, but the connection never completes, often timing out.
*   **One-Way Audio/Video:** In a more complex scenario, one peer might be able to send data, but not receive it, indicating a partial connection failure due to NAT.
*   **High Latency/Packet Loss (when TURN is used as fallback):** If a direct peer-to-peer connection cannot be established, WebRTC falls back to using a TURN server. While this allows connection, it can introduce higher latency and potentially more packet loss compared to a direct connection.

## 3. Common Causes of NAT Failure

*   **Symmetric NAT:** This is the most restrictive type of NAT. It maps internal IP/port pairs to a unique external IP/port pair for each destination. This makes direct peer-to-peer connections very difficult, often requiring a TURN server.
*   **Firewall Restrictions:** Firewalls (both software and hardware) can block UDP ports, which are essential for STUN and direct WebRTC connections.
*   **Router Configuration:** Incorrect router settings, such as disabled UPnP (Universal Plug and Play) or strict security policies, can hinder NAT traversal.
*   **Double NAT:** When a device is behind two layers of NAT (e.g., a router connected to another router), it significantly complicates NAT traversal.

## 4. Troubleshooting Steps

### 4.1. Check Network Type

*   **Identify NAT Type:** Use online tools or network diagnostic software to determine the NAT type of both the client and host networks. Symmetric NATs are the most problematic.

### 4.2. Firewall and Antivirus Settings

*   **Temporarily Disable:** Temporarily disable firewalls and antivirus software on both the client and host devices to see if they are blocking the connection. If this resolves the issue, add exceptions for RemoteDesk.
*   **Allow UDP Traffic:** Ensure that UDP traffic on ports 3478 (STUN/TURN) and a range of high-numbered UDP ports (for media) is allowed outbound and inbound.

### 4.3. Router Configuration

*   **Enable UPnP/NAT-PMP:** If available and secure to do so, enable UPnP or NAT-PMP on the router. These protocols allow applications to automatically configure port forwarding.
*   **Port Forwarding:** As a last resort, manually configure port forwarding on the router for the specific UDP ports used by WebRTC. This is often complex and less ideal for dynamic connections.
*   **Disable Double NAT:** If you suspect double NAT, try to configure one of the routers in bridge mode or ensure only one device is performing NAT.

### 4.4. RemoteDesk Application Settings

*   **TURN Server Configuration:** Ensure RemoteDesk is correctly configured to use TURN servers as a fallback. If you are self-hosting, verify the TURN server is accessible and correctly configured (see `turn-failure-guide.md`).
*   **WebRTC Logs:** Enable detailed WebRTC logging within the RemoteDesk application (if available) to get more insights into ICE candidate gathering and connection failures (see `ice-candidate-debugging.md`).

## 5. Diagnostic Information for Support

If NAT traversal issues persist, please provide the following information to support:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of failed connection attempts.
3.  **Network Environment:** Detailed description of the network setup on both ends (e.g., router model, ISP, corporate network, public Wi-Fi, VPN usage).
4.  **NAT Type:** If known, the NAT type identified for both networks.
5.  **Firewall/Antivirus Status:** Whether firewalls or antivirus software are active and if exceptions have been added.
6.  **WebRTC Logs:** Relevant sections of the WebRTC logs from both devices, focusing on ICE candidate gathering and connection state changes.

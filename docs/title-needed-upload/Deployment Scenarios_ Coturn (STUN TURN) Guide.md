# Deployment Scenarios: Coturn (STUN/TURN) Guide

Coturn is an open-source implementation of STUN and TURN servers, which are essential for WebRTC NAT traversal. While STUN works for many users, TURN is a critical fallback for those on restrictive networks. This document provides a guide for deploying Coturn for RemoteDesk.

## 1. Why Coturn?

*   **NAT Traversal:** Helps peers discover their public IP addresses (STUN).
*   **Relay Fallback:** Relays media traffic when a direct peer-to-peer connection cannot be established (TURN).
*   **Essential for Reliability:** Without a TURN server, a significant percentage of remote sessions (estimated 10-15%) will fail to connect.

## 2. Deployment Options

### 2.1. On the Same VPS as the Backend

Simple and cost-effective for small deployments.

*   **Pros:** No additional server costs, easier to manage initially.
*   **Cons:** Bandwidth and CPU are shared with other services.

### 2.2. On a Dedicated VPS

Recommended for production and higher scale.

*   **Pros:** Isolated resources, better performance, can be placed in multiple geographical regions.
*   **Cons:** Additional server costs.

## 3. Configuration Steps

### 3.1. Installation

`sudo apt update && sudo apt install coturn -y`

### 3.2. Basic `turnserver.conf` Configuration

```conf
# /etc/turnserver.conf

# Enable TURN and STUN
listening-port=3478
tls-listening-port=5349

# Use a static secret for authentication (integrated with your API)
use-auth-secret
static-auth-secret=your_very_secure_static_secret
realm=yourdomain.com

# Network settings
listening-ip=0.0.0.0
external-ip=YOUR_PUBLIC_IP_ADDRESS

# Relay ports
min-port=49152
max-port=65535

# Logging
log-file=/var/log/turnserver.log
verbose

# Security
no-stdout-log
no-loopback-peers
no-multicast-peers
```

### 3.3. Firewall Configuration

Open the following ports on your VPS:
*   **3478 (UDP/TCP):** STUN/TURN listening port.
*   **5349 (UDP/TCP):** TURN over TLS.
*   **49152-65535 (UDP):** Relay port range.

### 3.4. Enabling the Service

Edit `/etc/default/coturn` and set `TURNSERVER_ENABLED=1`.
Then start the service: `sudo systemctl start coturn`.

## 4. Application Integration

Your backend API needs to generate time-limited TURN credentials for clients using the `static-auth-secret`. These credentials are then passed to the WebRTC `RTCPeerConnection` configuration.

## 5. Testing Coturn

Use the [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) tool to verify that your STUN/TURN server is working correctly and gathering candidates.

## 6. Scaling and High Availability

*   **Multiple Regions:** Deploy Coturn instances in different geographical regions to reduce latency for global users.
*   **Load Balancing:** Use a DNS-based load balancer or a dedicated load balancer (with UDP support) to distribute traffic across multiple Coturn instances.

## 7. Related Documents

*   `deployment-single-vps.md`
*   `webrtc-nat-failure-guide.md`
*   `webrtc-turn-failure-guide.md`
*   `webrtc-ice-candidate-debugging.md`
*   `deployment-qa.md`

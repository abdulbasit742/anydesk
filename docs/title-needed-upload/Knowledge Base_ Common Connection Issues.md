# Knowledge Base: Common Connection Issues

This article provides troubleshooting steps for the most frequent connection issues encountered by RemoteDesk users. It is intended for both support agents and end-users to quickly diagnose and resolve connectivity problems.

## 1. Unable to Connect to Remote Device

**Symptom:** The user enters the 9-digit RemoteDesk ID, but the connection fails to establish, often resulting in a timeout or a "Device Offline" message.

**Potential Causes and Solutions:**

*   **Device is Offline or Asleep:** The most common cause is that the target device is turned off, in sleep mode, or not connected to the internet.
    *   *Solution:* Verify that the remote device is powered on, awake, and has an active internet connection. If unattended access is required, ensure the device is configured to prevent sleeping.
*   **RemoteDesk Application is Not Running:** The RemoteDesk application must be actively running on the target device to accept connections.
    *   *Solution:* Ask the user on the remote end to verify that the RemoteDesk application is open and displaying their 9-digit ID.
*   **Firewall or Antivirus Blocking Connection:** Strict firewall rules or aggressive antivirus software on either the host or client machine may block the necessary ports or protocols (specifically WebRTC and WebSocket traffic).
    *   *Solution:* Temporarily disable the firewall or antivirus to test if it resolves the issue. If it does, add exceptions for the RemoteDesk application and its associated network traffic.
*   **Network Restrictions (Corporate/Public Wi-Fi):** Corporate networks or public Wi-Fi hotspots often have restrictive NAT (Network Address Translation) policies or block peer-to-peer connections.
    *   *Solution:* If on a restrictive network, the connection may rely on our TURN servers. Ensure that outbound traffic on port 443 (TCP/UDP) and port 3478 (TCP/UDP) is allowed.

## 2. Connection Drops Frequently

**Symptom:** The connection is established successfully but drops intermittently during the session.

**Potential Causes and Solutions:**

*   **Unstable Internet Connection:** A weak or fluctuating internet connection on either the host or client side is the primary cause of dropped sessions.
    *   *Solution:* Advise the user to switch to a more stable connection, preferably a wired Ethernet connection instead of Wi-Fi. Check for packet loss or high latency.
*   **High Network Congestion:** Heavy network usage (e.g., large downloads, streaming) on the local network can interfere with the real-time data transfer required by RemoteDesk.
    *   *Solution:* Pause other bandwidth-intensive activities during the remote session.
*   **Resource Exhaustion on Host Device:** If the remote device is under heavy load (high CPU or RAM usage), it may struggle to process and transmit the screen capture data, leading to a dropped connection.
    *   *Solution:* Close unnecessary applications on the remote device to free up system resources.

## 3. "Connection Rejected" Message

**Symptom:** The user attempts to connect, but immediately receives a "Connection Rejected" message.

**Potential Causes and Solutions:**

*   **Manual Rejection:** The user on the remote end explicitly clicked the "Reject" button when the connection request appeared.
    *   *Solution:* Communicate with the remote user to ensure they are expecting the connection and are ready to accept it.
*   **Unattended Access Not Configured:** If attempting to connect without user interaction on the remote end, unattended access must be properly configured with a secure password.
    *   *Solution:* Verify that unattended access is enabled on the remote device and that the correct password is being used.
*   **Security Policies:** Enterprise security policies may restrict incoming connections based on IP address, user role, or time of day.
    *   *Solution:* Check the administrative dashboard to ensure the connection attempt complies with all configured security policies.

## Diagnostic Information Required for Support

If the issue persists after following these troubleshooting steps, please gather the following information before escalating to the engineering team:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) when the connection attempts failed.
3.  **Operating Systems:** The OS versions of both the client and host devices.
4.  **Network Environment:** A brief description of the network setup (e.g., home Wi-Fi, corporate network, VPN).
5.  **Error Messages:** Any specific error codes or messages displayed in the application.
6.  **Application Logs:** If possible, export the application logs from both devices (see `support-diagnostics-guide.md` for instructions).

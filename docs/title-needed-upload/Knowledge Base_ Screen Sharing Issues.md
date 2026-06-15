# Knowledge Base: Screen Sharing Issues

This article addresses common problems encountered during screen sharing sessions in RemoteDesk, providing troubleshooting steps for both support agents and end-users.

## 1. Blank Screen or Black Screen During Session

**Symptom:** The remote viewer sees a blank or black screen instead of the host's desktop.

**Potential Causes and Solutions:**

*   **Hardware Acceleration Issues:** Sometimes, graphics drivers or hardware acceleration settings can interfere with screen capture.
    *   *Solution:* On the host device, try disabling hardware acceleration in the RemoteDesk application settings or in the browser (for web-based screen sharing). Update graphics drivers to the latest version.
*   **Conflicting Applications:** Other screen recording, streaming, or security applications might conflict with RemoteDesk's screen capture mechanism.
    *   *Solution:* Close any other applications that might be accessing the screen or graphics card on the host device.
*   **Display Settings/Multiple Monitors:** Issues can arise with specific display configurations, especially with multiple monitors or high-DPI screens.
    *   *Solution:* On the host device, try changing the display resolution, disconnecting secondary monitors, or ensuring the correct monitor is selected for sharing within RemoteDesk.
*   **Security Software Interference:** Antivirus or endpoint security solutions might prevent RemoteDesk from accessing the screen buffer.
    *   *Solution:* Temporarily disable security software or add RemoteDesk to its whitelist. Consult `security-training-guide.md` for more details on security configurations.

## 2. Laggy or Choppy Screen Sharing

**Symptom:** The remote screen updates slowly, appears choppy, or has significant delay.

**Potential Causes and Solutions:**

*   **Insufficient Bandwidth:** The most common cause is limited network bandwidth on either the host or client side. High-resolution screens and rapid screen changes require more bandwidth.
    *   *Solution:* Reduce the display resolution on the host device. Ensure both devices have a stable, high-bandwidth internet connection. Prioritize network traffic for RemoteDesk if possible. Check `cost-capacity-turn-bandwidth-calculator.md` for bandwidth estimations.
*   **High CPU Usage on Host:** If the host device's CPU is overloaded, it may struggle to capture, encode, and transmit the screen data efficiently.
    *   *Solution:* Close unnecessary applications on the host device. Check task manager for CPU-intensive processes.
*   **Network Latency:** High latency (ping) between the host and client can cause delays in screen updates.
    *   *Solution:* Use a network diagnostic tool to check latency. If connecting over long distances, some latency is unavoidable. Ensure TURN servers are optimally located if used.
*   **WebRTC Congestion Control:** WebRTC dynamically adjusts video quality based on network conditions. If conditions are poor, it will reduce quality, but can still appear laggy.
    *   *Solution:* While not directly user-configurable, understanding this helps explain the behavior. Improving network conditions is the best approach.

## 3. Incorrect Colors or Distorted Display

**Symptom:** The remote screen shows incorrect colors, visual artifacts, or distorted images.

**Potential Causes and Solutions:**

*   **Graphics Driver Issues:** Outdated or corrupted graphics drivers can lead to rendering problems.
    *   *Solution:* Update graphics drivers on the host device to the latest stable version.
*   **Color Profile Mismatch:** Rarely, differing color profiles between host and client displays can cause slight color shifts.
    *   *Solution:* This is usually a minor aesthetic issue and often resolves itself with driver updates or by ensuring standard color profiles are used.
*   **Encoding/Decoding Errors:** Issues during the video encoding on the host or decoding on the client can cause distortion.
    *   *Solution:* Restart both RemoteDesk applications. If persistent, check for application updates.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) when the screen sharing issues occurred.
3.  **Operating Systems & Browser Versions:** OS versions of both client and host, and browser version if connecting via web.
4.  **Graphics Card & Driver Version:** Details of the graphics hardware and driver version on the host device.
5.  **Network Speed Test Results:** Speed test results (upload/download, ping) from both host and client.
6.  **Error Messages:** Any specific error codes or messages displayed.
7.  **Application Logs:** Export application logs from both devices (refer to `support-diagnostics-guide.md`).

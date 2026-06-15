# RemoteDesk Support Bundle Checklist

This checklist outlines the essential information and files to collect when creating a support bundle for troubleshooting issues in RemoteDesk. A comprehensive support bundle helps the development team diagnose and resolve problems more efficiently.

## 1. General Information

*   [ ] **Problem Description**: A detailed description of the issue, including:
    *   What happened?
    *   When did it happen?
    *   How often does it happen (reproducibility steps)?
    *   What were you trying to achieve?
    *   Any error messages displayed (screenshots are helpful).
*   [ ] **Environment Details**:
    *   Operating System (e.g., Windows 10, macOS Ventura, Ubuntu 22.04).
    *   RemoteDesk Application Version (Host and Viewer, if applicable).
    *   Browser Version (for web dashboard, e.g., Chrome 120).
    *   Node.js Version (if running local API/development setup).
    *   Network configuration (e.g., behind NAT, corporate firewall, VPN).

## 2. Logs

### 2.1 Desktop Client Logs (Host and Viewer)

*   [ ] **Electron Main Process Logs**: These logs are typically output to the console where the Electron app was launched or to a log file in a temporary directory. Include the full output.
*   [ ] **Electron Renderer Process Logs**: Save the console output from the Developer Tools (`Ctrl+Shift+I` or `Cmd+Option+I`). Include all tabs (Console, Network, etc.).
*   [ ] **`chrome://webrtc-internals` Dump**: For any WebRTC-related issues (connection, audio/video quality), generate and include the `webrtc-internals` dump from both Host and Viewer clients.

### 2.2 API Service Logs

*   [ ] **API Server Console Logs**: The full console output from when the API service was started and the issue occurred.
*   [ ] **Socket.IO Debug Logs**: If `DEBUG=socket.io:*,engine:*` was enabled, include these verbose logs.
*   [ ] **Prisma Query Logs**: If Prisma query logging was enabled, include these logs.

### 2.3 Web Dashboard Logs

*   [ ] **Browser Console Logs**: Save the console output from the browser Developer Tools.
*   [ ] **Network Tab Capture**: Capture network requests from the browser Developer Tools during the issue.

## 3. Configuration Files

*   [ ] **`.env` files**: Include the `.env` files (or their relevant contents) used by `apps/api`, `apps/web`, and `apps/desktop`. **Ensure sensitive information (passwords, API keys) is redacted or replaced with placeholders before sharing.**
*   [ ] **`docker-compose.yml`**: If using Docker, include your `docker-compose.yml` file.
*   [ ] **`turnserver.conf`**: If self-hosting a TURN server, include its configuration file (redact sensitive info).

## 4. Screenshots and Recordings

*   [ ] **Screenshots**: Capture screenshots of any error messages, unexpected UI behavior, or relevant application states.
*   [ ] **Screen Recording**: A short screen recording of the issue occurring can be extremely helpful for understanding the user experience and reproduction steps.

## 5. Network Information

*   [ ] **`ipconfig /all` (Windows) or `ifconfig` / `ip a` (Linux/macOS)**: Output of network configuration commands.
*   [ ] **`ping` and `traceroute` / `tracert`**: Results of pinging the API server, signaling server, and TURN server (if applicable) from both Host and Viewer machines.

## 6. Steps to Reproduce

*   [ ] Provide clear, step-by-step instructions that reliably reproduce the issue. If the issue is intermittent, describe the conditions under which it usually occurs.

## 7. Expected vs. Actual Behavior

*   [ ] Clearly state what you expected to happen and what actually happened.

## 8. Package and Share

*   [ ] Compress all collected files into a single `.zip` or `.tar.gz` archive.
*   [ ] **Redact sensitive information**: Double-check all files for any passwords, API keys, or personal identifiable information before sharing.
*   [ ] Share the archive with the support team through the designated channel.

---

**Author**: Manus AI
**Date**: June 12, 2026

# Support Checklist for RemoteDesk Issues

This checklist provides a structured approach for support agents to follow when handling user-reported issues with RemoteDesk. Following this process ensures that all essential information is gathered and that common troubleshooting steps are performed consistently.

## 1. Initial Information Gathering

*   [ ] **User ID / Email:** Identify the user and their account type.
*   [ ] **RemoteDesk IDs:** Get the 9-digit IDs for both the Client and Host devices.
*   [ ] **Problem Description:** Clearly document what the user is experiencing.
*   [ ] **Timestamp:** Record when the issue occurred (including timezone).
*   [ ] **Frequency:** Is it a one-time event, intermittent, or constant?
*   [ ] **Environment:** Note the OS and browser/app version for both peers.

## 2. Basic Troubleshooting (The "Quick Fixes")

*   [ ] **Check Internet Connection:** Ensure both peers have a stable internet connection.
*   [ ] **Restart Application/Browser:** Ask the user to restart RemoteDesk or their browser.
*   [ ] **Check for Updates:** Ensure both peers are running the latest version of RemoteDesk.
*   [ ] **Verify Permissions:** Check that Screen Recording and Accessibility permissions are granted (especially on macOS).
*   [ ] **Check Device Status:** Verify that the host device is online and not in sleep mode.

## 3. Connection and WebRTC Troubleshooting

*   [ ] **Check Connection State:** What is the connection status shown in the app (e.g., "Connecting...", "Disconnected")?
*   [ ] **Identify NAT Issues:** Is the user on a restrictive corporate network or behind a symmetric NAT?
*   [ ] **Verify TURN Usage:** Is the session successfully falling back to a TURN server if P2P fails?
*   [ ] **Review WebRTC Internals:** If possible, obtain a `chrome://webrtc-internals` or `about:webrtc` dump.
*   [ ] **Check for Packet Loss/Latency:** Use `getStats` or a speed test to identify network quality issues.

## 4. Feature-Specific Troubleshooting

*   [ ] **Remote Input:** If mouse/keyboard don't work, verify Accessibility permissions and "Allow Remote Input" settings.
*   [ ] **File Transfer:** If failing, check disk space, file size limits, and "Allow File Transfer" settings.
*   [ ] **Clipboard Sync:** Verify "Allow Clipboard Sync" is enabled on both sides.
*   [ ] **Audio/Video:** Check for correct input/output device selection and volume levels.

## 5. Diagnostic Data Collection

*   [ ] **Collect Application Logs:** Guide the user to find and send their desktop app logs.
*   [ ] **Collect Browser Console Logs:** For web client issues, request the console output.
*   [ ] **Run Diagnostics Tool:** If available, ask the user to run the built-in support diagnostics tool.
*   [ ] **Capture Screenshots/Recordings:** Request visual evidence of the issue or error messages.

## 6. Escalation and Documentation

*   [ ] **Check Knowledge Base:** Search the internal KB for similar issues and known solutions.
*   [ ] **Check Known Issues/Bug Tracker:** See if the problem is already a known bug.
*   [ ] **Document Findings:** Record all gathered information, troubleshooting steps taken, and results in the support ticket.
*   [ ] **Escalate if Necessary:** If the issue cannot be resolved, escalate to Tier 2 support or Engineering with all collected diagnostic data.

## 7. Related Documents

*   `support-diagnostics-guide.md`
*   `kb-common-connection-issues.md`
*   `webrtc-nat-failure-guide.md`
*   `webrtc-turn-failure-guide.md`
*   `support-diagnostics-desktop.md`
*   `support-diagnostics-web.md`
*   `support-diagnostics-api.md`
*   `support-diagnostics-socket.md`
*   `support-diagnostics-webrtc.md`

# Support Diagnostics Guide

This guide provides a structured approach for collecting diagnostic information to troubleshoot issues encountered by RemoteDesk users. Effective diagnostics are crucial for quickly identifying the root cause of problems and providing timely resolutions.

## 1. Overview

When a user reports an issue, the support team needs specific information to understand the problem, replicate it, and determine a solution. This guide outlines the types of information to collect and how to obtain them from the user or the system.

## 2. General Information to Collect

Before diving into specific technical details, always gather the following general information:

*   **User ID/Account Information:** To identify the user and their subscription details.
*   **RemoteDesk IDs:** The 9-digit IDs of both the client and host devices involved in the session.
*   **Problem Description:** A clear and concise description of the issue. What happened? What was expected to happen? When did it start?
*   **Steps to Reproduce:** Detailed steps that consistently lead to the issue. If it's intermittent, note the conditions under which it usually occurs.
*   **Date and Time:** The exact date and time (including timezone) when the issue occurred or was last observed.
*   **Frequency:** How often does the issue occur (always, sometimes, rarely)?
*   **Impact:** How does this issue affect the user's workflow or ability to use RemoteDesk?

## 3. Technical Diagnostic Information

### 3.1. Operating System and Hardware Details

*   **Client OS:** Operating System (Windows, macOS, Linux, Android, iOS) and its version.
*   **Client Hardware:** Device model, CPU, RAM, GPU.
*   **Host OS:** Operating System (Windows, macOS, Linux) and its version.
*   **Host Hardware:** Device model, CPU, RAM, GPU.

### 3.2. Network Information

*   **Network Type:** Home Wi-Fi, corporate network, public Wi-Fi, mobile data, VPN.
*   **Internet Service Provider (ISP):** Name of the ISP for both client and host.
*   **Speed Test Results:** Upload and download speeds, and ping (e.g., from [Speedtest.net](https://www.speedtest.net/)).
*   **Firewall/Antivirus:** Is any firewall or antivirus software active? Are exceptions made for RemoteDesk?
*   **Router/Modem Information:** Model and manufacturer (if user can provide).

### 3.3. Application-Specific Logs

RemoteDesk applications generate logs that are invaluable for diagnostics.

*   **Desktop Application Logs:** Located in a specific directory (e.g., `~/.remotedesk/logs` on Linux/macOS, `%APPDATA%\RemoteDesk\logs` on Windows). These logs contain detailed information about application events, errors, and WebRTC activity.
*   **Web Client Console Logs:** Instructions for users to open browser developer tools (F12), navigate to the 'Console' tab, and save the logs.
*   **WebRTC Internals Dump:** For WebRTC-related issues, request the user to navigate to `chrome://webrtc-internals` (or `about:webrtc` for Firefox) during an active or failed session and save the full dump. This provides deep insights into ICE candidates, connection states, and media statistics.

### 3.4. Screenshots and Screen Recordings

*   **Screenshots:** Request screenshots of error messages, unexpected UI behavior, or relevant settings.
*   **Screen Recordings:** A short video demonstrating the issue can be extremely helpful, especially for intermittent or complex UI/interaction problems.

## 4. How to Guide Users for Data Collection

*   **Provide Clear Instructions:** Offer step-by-step instructions, possibly with screenshots or short video tutorials, on how to collect logs or perform diagnostic tests.
*   **Use a Diagnostic Tool (if available):** If RemoteDesk provides a built-in diagnostic tool, guide the user on how to run it and export the results (see `support-diagnostics-tool.md`).
*   **Emphasize Privacy:** Assure users that sensitive information will be handled with care and only used for troubleshooting purposes.

## 5. Analyzing Diagnostic Data

Once data is collected, the support team will:

*   **Review Logs:** Look for error messages, warnings, and unusual patterns.
*   **Correlate Timestamps:** Match events in logs with the reported time of the issue.
*   **Check WebRTC Internals:** Analyze ICE candidate gathering, connection states, and media statistics for WebRTC issues.
*   **Reproduce Issue:** Attempt to reproduce the issue in a similar environment using the collected information.

## 6. Related Documents

*   `kb-common-connection-issues.md`
*   `webrtc-nat-failure-guide.md`
*   `webrtc-turn-failure-guide.md`
*   `webrtc-ice-candidate-debugging.md`
*   `support-diagnostics-tool.md`
*   `support-diagnostics-data-collection.md`

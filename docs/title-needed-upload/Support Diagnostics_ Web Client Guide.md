# Support Diagnostics: Web Client Guide

This guide provides specific instructions for collecting diagnostic information from the RemoteDesk web client. This information is essential for troubleshooting dashboard issues, connection failures in the browser, and performance problems during web-based remote sessions.

## 1. Browser Information

Provide the following details about the browser being used to access RemoteDesk:

*   **Browser Name and Version:** (e.g., Google Chrome 120.0.6099.129, Mozilla Firefox 121.0).
*   **Operating System:** (e.g., Windows 11, macOS Sonoma, Android 14, iOS 17).
*   **Extensions:** List any active browser extensions, especially ad-blockers, script-blockers, or VPN extensions, as these can interfere with WebRTC.

## 2. Browser Console Logs

The browser console contains valuable error messages and debugging information.

1.  Open the RemoteDesk web dashboard.
2.  Open Developer Tools (usually **F12** or **Ctrl+Shift+I** / **Cmd+Option+I**).
3.  Navigate to the **Console** tab.
4.  Right-click anywhere in the console and select **Save as...** to save the logs to a text file.
5.  Send this file to the support team.

## 3. Network Tab Information

The Network tab shows the status of all requests made by the browser.

1.  Open Developer Tools and navigate to the **Network** tab.
2.  Refresh the page or perform the action that is causing the issue.
3.  Look for any failed requests (highlighted in red).
4.  Right-click on the request list and select **Save all as HAR with content**.
5.  Send the resulting `.har` file to support. **Note:** HAR files can contain sensitive information like session cookies; redact them if necessary.

## 4. WebRTC Internals Dump

For issues during a remote session in the browser, a WebRTC internals dump is the most important diagnostic tool.

1.  While a session is active (or immediately after a failed attempt), open a new tab in the same browser.
2.  Navigate to `chrome://webrtc-internals` (Chrome/Edge) or `about:webrtc` (Firefox).
3.  Click the button to **Download the current WebRTC internals data** (Chrome) or **Save Page** (Firefox).
4.  Send the resulting file to support.

## 5. Connection and Performance Details

*   **Internet Connection Type:** (e.g., Home Wi-Fi, Office Ethernet, Mobile Data, Public Wi-Fi).
*   **VPN/Proxy:** Are you using a VPN or a proxy server?
*   **Speed Test:** Provide results from a speed test (e.g., [Speedtest.net](https://www.speedtest.net/)), including upload/download speeds and ping/jitter.
*   **Latency/Lag:** Describe the nature of any lag (e.g., delayed mouse movement, stuttering video).

## 6. Screenshots

*   **UI Issues:** Take a screenshot of any visual bugs or layout problems on the dashboard.
*   **Error Dialogs:** Capture any error messages that appear in the browser.

## 7. Troubleshooting Steps Already Taken

Briefly list any steps you've already tried, such as:
*   Clearing browser cache and cookies.
*   Trying a different browser.
*   Disabling browser extensions.
*   Restarting the browser or computer.

## 8. Related Documents

*   `support-diagnostics-guide.md`
*   `webrtc-getstats-debugging-guide.md`
*   `web-ux-error-states.md`
*   `webrtc-troubleshooting-qa.md`

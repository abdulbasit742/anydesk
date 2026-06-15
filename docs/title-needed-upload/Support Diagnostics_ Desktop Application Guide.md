# Support Diagnostics: Desktop Application Guide

This guide provides specific instructions for collecting diagnostic information from the RemoteDesk desktop application (Windows, macOS, Linux). This information is crucial for troubleshooting installation issues, application crashes, performance problems, and remote control failures.

## 1. Automated Diagnostics

The easiest way to collect diagnostic data is to use the built-in "Support Tool" or "Diagnostics" feature within the application (if available).

1.  Open the RemoteDesk application.
2.  Navigate to **Settings** > **Support** or **Help** > **Run Diagnostics**.
3.  The tool will automatically gather system information, application logs, and network details.
4.  Once complete, it will provide a compressed file (e.g., `RemoteDesk_Diagnostics_[Date].zip`).
5.  Send this file to the support team.

## 2. Manual Log Collection

If the automated tool is unavailable or the application cannot be opened, logs can be collected manually.

### 2.1. Log File Locations

| Operating System | Log Directory Path |
| :--------------- | :----------------- |
| **Windows** | `%APPDATA%\RemoteDesk\logs` |
| **macOS** | `~/Library/Logs/RemoteDesk` |
| **Linux** | `~/.config/remotedesk/logs` |

**Action:** Copy all files in the `logs` directory, compress them into a single archive, and send them to support.

### 2.2. Crash Dumps

If the application crashes, it may generate crash dumps.

| Operating System | Crash Dump Location |
| :--------------- | :------------------ |
| **Windows** | `%APPDATA%\RemoteDesk\crashes` |
| **macOS** | `~/Library/Logs/DiagnosticReports` (Look for RemoteDesk-related files) |
| **Linux** | System-dependent (e.g., `/var/crash` or managed by `systemd-coredump`) |

## 3. System and Environment Information

Provide the following details about the computer running the RemoteDesk desktop application:

*   **Operating System:** Exact version and build (e.g., Windows 11 Pro 23H2, macOS Sonoma 14.2.1).
*   **CPU:** Model and speed (e.g., Intel Core i7-12700K).
*   **RAM:** Total amount (e.g., 16 GB).
*   **GPU:** Model and driver version (especially for video encoding/decoding issues).
*   **Antivirus/Firewall:** List any active security software.
*   **Other Remote Desktop Software:** Are any other remote access tools installed or running?

## 4. Network Diagnostics (Manual)

Run the following commands in a terminal/command prompt and provide the output:

*   **IP Configuration:** `ipconfig /all` (Windows) or `ifconfig` / `ip a` (macOS/Linux).
*   **Ping to RemoteDesk Servers:** `ping api.remotedesk.com` and `ping signaling.remotedesk.com`.
*   **Traceroute:** `tracert api.remotedesk.com` (Windows) or `traceroute api.remotedesk.com` (macOS/Linux).
*   **Port Connectivity:** Check if port 443 (HTTPS/WSS) and WebRTC ports (UDP 1024-65535) are open and reachable.

## 5. Screen and Input Diagnostics

*   **Multiple Monitors:** How many monitors are connected? What are their resolutions?
*   **Input Devices:** Are you using a standard mouse and keyboard, or any specialized input devices?
*   **Permissions (macOS/Linux):** Verify that RemoteDesk has "Screen Recording" and "Accessibility" permissions in System Settings.

## 6. Screenshots and Recordings

*   **Error Messages:** Take a screenshot of any error messages or dialogs that appear.
*   **Visual Issues:** If the remote screen looks distorted or has artifacts, take a screenshot or a short screen recording.

## 7. Related Documents

*   `support-diagnostics-guide.md`
*   `support-diagnostics-tool.md`
*   `webrtc-troubleshooting-qa.md`
*   `desktop-ux-error-copy.md`

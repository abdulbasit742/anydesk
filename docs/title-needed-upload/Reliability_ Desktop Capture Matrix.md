# Reliability: Desktop Capture Matrix

This document outlines the compatibility and known behaviors of RemoteDesk's desktop capture functionality across various operating systems and display configurations. Effective screen capture is fundamental to a remote desktop application, and understanding its nuances is crucial for reliability.

## 1. Supported Desktop Capture Methods

RemoteDesk employs different capture methods depending on the operating system to achieve optimal performance and compatibility.

| Operating System | Primary Capture Method | Fallback Method(s) | Notes |
| :--------------- | :--------------------- | :----------------- | :---- |
| **Windows** | Desktop Duplication API (Windows 8+) | GDI (Graphics Device Interface) Capture | Offers high performance and low CPU usage. GDI is a fallback for older systems or specific scenarios. |
| **macOS** | ScreenCaptureKit (macOS 12+) | Core Graphics Display Services | ScreenCaptureKit provides high-performance, privacy-preserving screen capture. Requires explicit user permission. |
| **Linux (Xorg)** | XShm (X Shared Memory) Extension | XFixes, Scrot | Efficient for Xorg-based desktop environments. |
| **Linux (Wayland)** | PipeWire (via xdg-desktop-portal) | (None, Wayland is strict) | Requires PipeWire and a compatible desktop environment. More secure but can be challenging to configure. |

## 2. Compatibility and Known Behaviors by OS

### Windows

*   **UAC Prompts:** When a User Account Control (UAC) prompt appears, the screen capture might show a blank or frozen screen to the remote viewer until the prompt is dismissed or accepted locally. This is a security feature of Windows.
*   **Secure Desktop:** Applications running on the Secure Desktop (e.g., Ctrl+Alt+Del screen, login screen) cannot be captured directly due to OS security restrictions.
*   **Hardware Acceleration:** Optimal performance is achieved when the host's graphics card drivers are up-to-date and hardware acceleration is enabled.
*   **Multiple Monitors:** Supports capturing individual monitors or the entire desktop across multiple displays.

### macOS

*   **Privacy Permissions:** RemoteDesk requires explicit 
user permission for "Screen Recording" in `System Settings > Privacy & Security`. Without this, screen sharing will result in a blank screen.
*   **Retina Displays:** High-resolution Retina displays are fully supported, but capturing and transmitting them can consume more bandwidth and CPU resources. Users may need to adjust resolution for performance.
*   **Virtual Desktops/Spaces:** Screen sharing typically follows the active space. Switching spaces on the host will update the remote view.

### Linux

*   **Xorg vs. Wayland:**
    *   **Xorg:** Generally robust for screen sharing. Performance can be good, but tearing might occur with some configurations.
    *   **Wayland:** More secure, but screen sharing requires `xdg-desktop-portal` and PipeWire. If these are not configured or available, screen sharing may fail or only allow sharing individual application windows, not the entire desktop. Users might need to install `xdg-desktop-portal` and ensure PipeWire is running.
*   **Desktop Environments:** Compatibility can vary slightly between desktop environments (GNOME, KDE, XFCE, etc.). Some may offer better integration with PipeWire or Xorg capture methods than others.
*   **Permissions:** Ensure the RemoteDesk application has the necessary permissions to access the display server.

## 3. Common Capture-Related Issues and Troubleshooting

*   **Blank/Black Screen:** Most often due to missing OS permissions (macOS, Linux Wayland), conflicting applications, or hardware acceleration issues. Refer to `kb-screen-sharing-issues.md`.
*   **Laggy/Choppy Video:** Insufficient bandwidth, high CPU usage on the host (especially during encoding), or an outdated graphics driver. Refer to `kb-screen-sharing-issues.md`.
*   **Incorrect Colors/Distortion:** Graphics driver issues or encoding/decoding problems. Refer to `kb-screen-sharing-issues.md`.
*   **Mouse Cursor Not Visible/Incorrectly Rendered:** Can be an issue with the capture method or specific display settings. Ensure cursor capture is enabled in RemoteDesk settings.

## 4. Diagnostic Information for Support

When reporting desktop capture issues, please provide:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of the issue.
3.  **Operating System and Version:** (e.g., Windows 11 23H2, macOS Sonoma 14.2, Ubuntu 22.04 LTS).
4.  **Graphics Card and Driver Version:** (e.g., NVIDIA GeForce RTX 3070, AMD Radeon RX 6800, Intel Iris Xe Graphics).
5.  **Display Configuration:** Number of monitors, resolutions, scaling settings.
6.  **Error Messages:** Any specific error messages displayed.
7.  **Application Logs:** Relevant logs from the RemoteDesk application (refer to `support-diagnostics-guide.md`).

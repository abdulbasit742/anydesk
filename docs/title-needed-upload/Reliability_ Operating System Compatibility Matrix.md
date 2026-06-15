# Reliability: Operating System Compatibility Matrix

This document details the operating system compatibility matrix for the RemoteDesk desktop application and web client. Ensuring broad OS compatibility is essential for providing a reliable remote access solution to a diverse user base.

## 1. Supported Operating Systems

RemoteDesk officially supports the following operating systems. We aim to support the latest stable versions and typically the two preceding major versions.

| Operating System | Supported Versions | Architecture | Notes |
| :--------------- | :----------------- | :----------- | :---- |
| **Windows** | Windows 10 (64-bit), Windows 11 (64-bit) | x64 | Recommended for full feature set and optimal performance. |
| **macOS** | macOS Ventura (13), macOS Sonoma (14) | x64, ARM64 (Apple Silicon) | Requires explicit security permissions for screen recording and input control. |
| **Linux** | Ubuntu 22.04 LTS, Ubuntu 24.04 LTS (64-bit) | x64 | Support for other Debian-based distributions may vary. |
| **Android** | Android 10 and newer | ARM, ARM64 | Web client access only. Dedicated mobile app planned for future. |
| **iOS/iPadOS** | iOS 15 and newer | ARM64 | Web client access only. Dedicated mobile app planned for future. |

## 2. Minimum System Requirements

To ensure a functional and responsive experience, users should meet the following minimum system requirements:

*   **Processor:** Dual-core CPU (2.0 GHz or faster)
*   **RAM:** 4 GB RAM (8 GB recommended for host devices or intensive use)
*   **Storage:** 500 MB free disk space for application installation
*   **Network:** Stable internet connection (broadband recommended)

## 3. Known Limitations and Considerations

*   **Security Permissions (macOS):** On macOS, users must grant explicit permissions for 
screen recording and accessibility (for input control) in System Settings > Privacy & Security. RemoteDesk will guide users through this process on first run.
*   **Linux Desktop Environments:** While RemoteDesk supports Ubuntu, compatibility with other Linux distributions and desktop environments (e.g., Fedora, KDE, GNOME) may vary. Users might need to manually install dependencies or configure display servers.
*   **Wayland vs. Xorg (Linux):** Screen sharing on Linux with Wayland display server can be more complex than with Xorg due to security restrictions. RemoteDesk will attempt to use PipeWire for Wayland screen sharing, but Xorg is generally more reliable for remote control.
*   **Windows UAC (User Account Control):** Remote control might be temporarily interrupted or require re-elevation when a UAC prompt appears on the host Windows machine.
*   **Driver Compatibility:** Ensure graphics and audio drivers are up-to-date on all operating systems for optimal performance, especially for screen capture and audio streaming.
*   **Unsupported Operating Systems:** Older versions of operating systems (e.g., Windows 7/8, older macOS versions) or niche operating systems are not officially supported. Users may experience unexpected behavior or lack of functionality.

## 4. Testing Strategy

Our OS compatibility testing involves:

*   **Virtual Machines/Physical Hardware:** Testing on a range of virtual machines and physical hardware representing the supported OS versions and architectures.
*   **Automated Tests:** Running automated end-to-end tests across different OS environments.
*   **Manual QA:** Dedicated QA cycles to verify critical functionalities (screen sharing, remote input, file transfer) on each supported OS.
*   **Beta Programs:** Utilizing beta users on various OS configurations to identify edge cases.

## 5. Reporting OS-Specific Issues

When reporting an OS compatibility issue, please include the following information:

*   **Operating System and Version:** (e.g., Windows 11 Home 23H2, macOS Sonoma 14.2.1, Ubuntu 22.04 LTS)
*   **Device Hardware:** (e.g., Dell XPS 15, MacBook Pro M1, Custom PC with Intel i7)
*   **Description of the Issue:** What happened, and what was expected?
*   **Steps to Reproduce:** Clear steps to consistently replicate the issue.
*   **Screenshots/Video:** Visual evidence of the problem.
*   **Application Logs:** Relevant logs from the RemoteDesk application (refer to `support-diagnostics-guide.md`).

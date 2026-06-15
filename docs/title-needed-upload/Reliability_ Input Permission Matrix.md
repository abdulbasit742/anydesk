# Reliability: Input Permission Matrix

This document details the input permission requirements for RemoteDesk across different operating systems and scenarios. RemoteDesk needs specific permissions to control the keyboard and mouse on the remote device, and these permissions vary significantly by OS, impacting the reliability of remote input.

## 1. Overview of Remote Input

RemoteDesk allows a client device to send keyboard and mouse input to a host device, enabling full control over the remote system. This functionality relies on the RemoteDesk application having the necessary operating system-level permissions to simulate input events.

## 2. Input Permission Requirements by Operating System

| Operating System | Permission Required | Configuration Steps | Notes |
| :--------------- | :------------------ | :------------------ | :---- |
| **Windows** | **Accessibility/Input Monitoring** | Typically granted automatically on installation or first use. May require UAC (User Account Control) elevation for certain actions. | UAC prompts can temporarily block input. Ensure RemoteDesk is running with sufficient privileges. |
| **macOS** | **Accessibility** (for keyboard/mouse control) & **Input Monitoring** (for advanced input features) | `System Settings > Privacy & Security > Accessibility` and `Input Monitoring`. User must manually add RemoteDesk and enable the checkbox. | Crucial for remote input. If not granted, remote input will not work. RemoteDesk will prompt the user. |
| **Linux (Xorg)** | **XInput Extension Access** | Usually granted by default when running as a graphical application. May require `sudo` or specific `xhost` configurations in some setups. | Generally less restrictive than macOS/Windows, but can vary by desktop environment and security settings. |
| **Linux (Wayland)** | **xdg-desktop-portal (Input Control)** | Requires a Wayland compositor that supports input control via `xdg-desktop-portal`. | Wayland's security model is stricter. Full remote input might be challenging or require specific portal implementations. |

## 3. Scenarios Affecting Input Permissions

*   **User Account Control (UAC) Prompts (Windows):** When a UAC dialog appears, remote input is typically blocked. The local user must interact with the UAC prompt.
*   **Login Screens / Lock Screens:** Remote input might be restricted on login or lock screens, especially if unattended access is not fully configured or if the OS requires local interaction for security.
*   **Secure Desktop (Windows):** Input is blocked on the Windows Secure Desktop (e.g., Ctrl+Alt+Del screen) for security reasons.
*   **Conflicting Applications:** Other applications that hook into system-level input (e.g., gaming overlays, accessibility tools, other remote desktop software) can interfere with RemoteDesk's ability to send input.
*   **Virtual Machines:** Input permissions within a virtual machine are managed by the VM's guest OS and the hypervisor. Ensure RemoteDesk has permissions within the guest OS.

## 4. Troubleshooting Remote Input Issues

*   **Verify Permissions:** Always check the operating system's security and privacy settings to ensure RemoteDesk has the necessary Accessibility/Input Monitoring permissions.
*   **Restart Application/OS:** Sometimes, granting permissions requires a restart of the RemoteDesk application or even the host operating system to take full effect.
*   **Check for Conflicts:** Temporarily disable other applications that might be interfering with input.
*   **Unattended Access Configuration:** For unattended access, ensure the system is configured to allow input at the login screen and that the unattended access password is correct.
*   **Review `kb-remote-input-issues.md`:** Consult the knowledge base article for common remote input problems and solutions.

## 5. Diagnostic Information for Support

When reporting input permission issues, please provide:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) of the issue.
3.  **Operating System and Version:** (e.g., Windows 11 23H2, macOS Sonoma 14.2, Ubuntu 22.04 LTS).
4.  **Specific Input Issue:** (e.g., keyboard not working, mouse clicks not registering, scroll wheel not functioning).
5.  **Permission Status:** Confirmation of whether Accessibility/Input Monitoring permissions have been granted for RemoteDesk on the host OS.
6.  **Error Messages:** Any specific error messages displayed.
7.  **Application Logs:** Relevant logs from the RemoteDesk application (refer to `support-diagnostics-guide.md`).

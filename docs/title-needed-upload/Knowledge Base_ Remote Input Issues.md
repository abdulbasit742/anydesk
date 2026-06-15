# Knowledge Base: Remote Input Issues

This article provides troubleshooting steps for common problems related to remote keyboard and mouse input during a RemoteDesk session. It is designed to assist both support agents and end-users in resolving input-related issues.

## 1. Keyboard or Mouse Input Not Working

**Symptom:** The remote viewer can see the host's screen, but their keyboard and/or mouse input has no effect on the remote device.

**Potential Causes and Solutions:**

*   **Permissions Not Granted:** On some operating systems (especially macOS and newer Windows versions), explicit security permissions are required for RemoteDesk to control the keyboard and mouse.
    *   *Solution:* On the host device, ensure that RemoteDesk has been granted the necessary accessibility or input monitoring permissions in the operating system's security and privacy settings. A restart of the RemoteDesk application or even the host device might be required after granting permissions.
*   **Input Mode Not Active:** The remote input feature might not be activated or might be in a view-only mode.
    *   *Solution:* Verify that the remote input mode is enabled in the RemoteDesk session toolbar or settings. Ensure the session is not in 
view-only mode. Remote input, clipboard, file transfer, recording, unattended access, and DLP must require explicit permission/policy.
*   **Host Device Lock Screen:** If the host device is at a lock screen or UAC (User Account Control) prompt, remote input might be restricted.
    *   *Solution:* The user on the host device may need to manually dismiss the lock screen or UAC prompt. For unattended access, ensure the system is configured to allow remote input at the login screen.
*   **Conflicting Applications:** Other applications that hook into keyboard/mouse input (e.g., gaming overlays, accessibility tools) might interfere.
    *   *Solution:* Close any such conflicting applications on the host device.

## 2. Keyboard Layout Mismatch

**Symptom:** Typing on the client keyboard produces incorrect characters on the remote device (e.g., `@` appears as `"`).

**Potential Causes and Solutions:**

*   **Different Keyboard Layouts:** The client and host devices are using different keyboard layouts (e.g., US English vs. UK English, QWERTY vs. AZERTY).
    *   *Solution:* Ensure that both the client and host devices are configured to use the same keyboard layout. This can usually be changed in the operating system settings.
*   **Application-Specific Layouts:** Some applications on the host might override the system keyboard layout.
    *   *Solution:* Check the settings of the specific application on the host device where the mismatch occurs.

## 3. Mouse Scroll Wheel Not Working

**Symptom:** The mouse cursor moves, and clicks register, but the scroll wheel has no effect on the remote device.

**Potential Causes and Solutions:**

*   **Application Focus:** The application on the remote device might not have focus, preventing scroll events from being registered.
    *   *Solution:* Click on the target application window on the remote screen to ensure it has focus.
*   **Driver Issues:** Rarely, specific mouse drivers or accessibility settings can interfere.
    *   *Solution:* Update mouse drivers on both client and host. Check accessibility settings on the host device.

## 4. Copy-Paste (Clipboard Sync) Issues

**Symptom:** Text or files copied on one device do not paste on the other.

**Potential Causes and Solutions:**

*   **Clipboard Sync Disabled:** The clipboard synchronization feature might be disabled in RemoteDesk settings.
    *   *Solution:* Verify that clipboard sync is enabled in the session settings. Clipboard safety guide (`security-training-clipboard-safety.md`) emphasizes explicit permission.
*   **Large Data Size:** Copying very large amounts of text or numerous files might fail due to size limitations or timeouts.
    *   *Solution:* Try copying smaller chunks of text or fewer files at a time. For large file transfers, use the dedicated file transfer feature.
*   **Conflicting Applications:** Other clipboard managers or security software can interfere.
    *   *Solution:* Temporarily disable other clipboard management tools.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) when the input issues occurred.
3.  **Operating Systems:** The OS versions of both the client and host devices.
4.  **Input Devices:** Details of the keyboard and mouse used on the client device.
5.  **Error Messages:** Any specific error codes or messages displayed.
6.  **Application Logs:** Export application logs from both devices (refer to `support-diagnostics-guide.md`).

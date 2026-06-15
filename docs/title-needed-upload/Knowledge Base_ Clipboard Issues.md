# Knowledge Base: Clipboard Issues

This article provides troubleshooting steps for common problems related to clipboard synchronization (copy-paste) during a RemoteDesk session. It is designed to assist both support agents and end-users in resolving clipboard-related issues.

## 1. Copy-Paste Not Working Between Devices

**Symptom:** Text or files copied on one device (host or client) cannot be pasted on the other device.

**Potential Causes and Solutions:**

*   **Clipboard Sync Disabled:** The clipboard synchronization feature might be explicitly disabled in RemoteDesk settings or by an administrative policy.
    *   *Solution:* Verify that clipboard sync is enabled in the active session settings. If it's an enterprise environment, check with your administrator. The `security-training-clipboard-safety.md` document outlines the need for explicit permission for this feature.
*   **Large Data Size:** Copying very large amounts of text, complex rich text formats, or numerous files might fail due to size limitations, memory constraints, or timeouts.
    *   *Solution:* Try copying smaller chunks of text or fewer files at a time. For large file transfers, use the dedicated file transfer feature instead of clipboard sync.
*   **Conflicting Applications:** Other clipboard managers, productivity tools, or security software on either the host or client device might interfere with RemoteDesk's clipboard operations.
    *   *Solution:* Temporarily disable any third-party clipboard management tools or security software to see if the issue resolves. If it does, add RemoteDesk to their whitelist.
*   **Operating System Restrictions:** Some operating systems or applications might have restrictions on clipboard access, especially for sensitive data.
    *   *Solution:* Ensure RemoteDesk has the necessary permissions to access the clipboard on both devices. A restart of the RemoteDesk application might refresh permissions.
*   **Temporary Glitch:** A transient software issue can sometimes cause clipboard sync to stop working.
    *   *Solution:* Restart the RemoteDesk application on both the client and host devices. If the problem persists, try restarting the entire session.

## 2. Pasted Content is Incomplete or Corrupted

**Symptom:** Content copied from one device pastes incompletely, incorrectly, or appears corrupted on the other device.

**Potential Causes and Solutions:**

*   **Rich Text Formatting Issues:** Copying content with complex formatting (e.g., from Word documents, web pages) might not transfer perfectly if the receiving application doesn't support the same rich text formats.
    *   *Solution:* Try pasting the content as plain text first. If that works, the issue is likely with rich text formatting. Consider using a plain text editor as an intermediary.
*   **Character Encoding Problems:** Rarely, different character encodings between systems can cause text corruption.
    *   *Solution:* This is less common with modern systems but can occur. Ensure system language settings are consistent if possible.
*   **Network Instability:** Although clipboard data is usually small, extreme network instability could theoretically cause minor corruption.
    *   *Solution:* Verify network stability. If the network is highly unstable, other session functionalities will also be affected.

## 3. Clipboard History Not Synchronizing

**Symptom:** If either the host or client uses a clipboard history tool, the history is not synchronized across the RemoteDesk session.

**Potential Causes and Solutions:**

*   **Feature Limitation:** RemoteDesk's clipboard sync typically only transfers the *current* clipboard content, not the entire history of a clipboard manager.
    *   *Solution:* This is expected behavior. Users should copy the specific item they wish to transfer. If a full clipboard history sync is required, it would be a feature request.

## Diagnostic Information Required for Support

If the issue persists after following these troubleshooting steps, please gather the following information before escalating to the engineering team:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) when the clipboard issues occurred.
3.  **Operating Systems:** The OS versions of both the client and host devices.
4.  **Content Type:** Describe what kind of content was being copied (plain text, rich text, image, file, etc.) and its approximate size.
5.  **Source and Destination Applications:** Which applications were used for copying and pasting on both ends.
6.  **Error Messages:** Any specific error codes or messages displayed.
7.  **Application Logs:** If possible, export the application logs from both devices (see `support-diagnostics-guide.md` for instructions).

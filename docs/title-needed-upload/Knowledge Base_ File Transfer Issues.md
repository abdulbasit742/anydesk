# Knowledge Base: File Transfer Issues

This article provides troubleshooting steps for common problems encountered during file transfers within RemoteDesk. It is designed to assist both support agents and end-users in resolving file transfer-related issues.

## 1. File Transfer Fails or Gets Stuck

**Symptom:** Files fail to transfer, the transfer progress gets stuck, or an error message indicates a transfer failure.

**Potential Causes and Solutions:**

*   **Network Connectivity Issues:** Unstable or slow network connections are a primary cause of failed file transfers.
    *   *Solution:* Ensure both the client and host devices have a stable internet connection. Check for packet loss or high latency. If on Wi-Fi, try a wired connection. Refer to `kb-common-connection-issues.md` for general network troubleshooting.
*   **Firewall or Antivirus Blocking:** Security software on either end might be blocking the file transfer ports or protocols.
    *   *Solution:* Temporarily disable firewalls or antivirus software to test. If it resolves the issue, add exceptions for RemoteDesk. File transfer safety guide (`security-training-file-transfer-safety.md`) emphasizes explicit permission.
*   **Insufficient Disk Space:** The target device might not have enough free disk space to receive the files.
    *   *Solution:* Check the available disk space on the receiving device and free up space if necessary.
*   **File Permissions:** Lack of appropriate read/write permissions on the source or destination folders can prevent transfers.
    *   *Solution:* Ensure the RemoteDesk application has the necessary permissions to access the source and destination directories on both devices.
*   **Large File Size/Number of Files:** Transferring extremely large files or a very high number of small files can sometimes lead to timeouts or resource exhaustion.
    *   *Solution:* Try transferring files in smaller batches. For very large files, ensure a stable connection and consider using a dedicated file synchronization service if RemoteDesk's built-in transfer is not sufficient for extreme cases.

## 2. Transferred Files are Corrupted or Incomplete

**Symptom:** Files appear to transfer successfully, but they are corrupted, incomplete, or cannot be opened on the receiving end.

**Potential Causes and Solutions:**

*   **Network Instability During Transfer:** Even if the transfer completes, underlying network instability (packet loss) can corrupt data.
    *   *Solution:* Re-attempt the transfer over a more stable network connection. Verify network integrity.
*   **Antivirus Interference:** Some antivirus programs might interfere with files during transfer, leading to corruption.
    *   *Solution:* Temporarily disable antivirus during transfer or add RemoteDesk to its whitelist.
*   **Disk Errors:** Rarely, disk errors on either the source or destination can cause file corruption.
    *   *Solution:* Run disk check utilities on both devices.

## 3. File Transfer Option is Missing or Disabled

**Symptom:** The option to transfer files is not visible or is greyed out in the RemoteDesk interface.

**Potential Causes and Solutions:**

*   **Feature Disabled by Policy:** In enterprise environments, file transfer might be disabled by administrative policy for security reasons.
    *   *Solution:* Check with your system administrator or the RemoteDesk admin dashboard to confirm if file transfer is allowed for your user role or session type.
*   **Session Type Restriction:** Certain session types (e.g., view-only) might not permit file transfers.
    *   *Solution:* Ensure the session is initiated with full control permissions.
*   **Application Glitch:** A temporary software issue might cause the option to disappear.
    *   *Solution:* Restart the RemoteDesk application on both client and host devices.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **RemoteDesk IDs:** Both the connecting (client) and target (host) 9-digit IDs.
2.  **Timestamps:** The exact date and time (including timezone) when the file transfer issues occurred.
3.  **Operating Systems:** The OS versions of both the client and host devices.
4.  **File Details:** Name, size, and type of the file(s) being transferred.
5.  **Error Messages:** Any specific error codes or messages displayed.
6.  **Application Logs:** Export application logs from both devices (refer to `support-diagnostics-guide.md`).

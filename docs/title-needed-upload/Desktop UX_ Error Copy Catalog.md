# Desktop UX: Error Copy Catalog

Consistent and clear error messages are essential for helping users understand what went wrong and how to fix it. This document provides a catalog of standardized error messages for the RemoteDesk desktop application.

## 1. Principles for Error Copy

*   **Be Clear and Concise:** Use simple language and avoid technical jargon where possible.
*   **Be Helpful:** Explain the problem and, if possible, provide a clear next step or solution.
*   **Be Polite and Empathetic:** Avoid blaming the user and use a supportive tone.
*   **Maintain Consistency:** Use the same terminology and tone across all error messages.
*   **Provide Context:** Tailor the message to the specific situation.

## 2. Error Message Catalog

### 2.1. Connection Errors

| Error Code | Situation | Error Message (Title & Body) | Recommended Action |
| :--------- | :-------- | :--------------------------- | :----------------- |
| **ERR_CONN_01** | Invalid 9-digit ID entered. | **Invalid ID**<br>The ID you entered is not valid. Please check the ID and try again. | Check ID and re-enter. |
| **ERR_CONN_02** | Remote device is offline. | **Device Offline**<br>The remote device is currently offline and cannot be reached. | Ensure remote device is on and connected to the internet. |
| **ERR_CONN_03** | Connection timed out. | **Connection Timed Out**<br>The connection attempt took too long. Please check your network and try again. | Check network and retry. |
| **ERR_CONN_04** | Session rejected by host. | **Connection Rejected**<br>The remote user has declined your connection request. | N/A |
| **ERR_CONN_05** | NAT traversal failed. | **Connection Failed**<br>Could not establish a direct connection. This may be due to restrictive network settings. | Refer to WebRTC troubleshooting guide. |

### 2.2. Authentication Errors

| Error Code | Situation | Error Message (Title & Body) | Recommended Action |
| :--------- | :-------- | :--------------------------- | :----------------- |
| **ERR_AUTH_01** | Incorrect password for unattended access. | **Incorrect Password**<br>The password you entered for this device is incorrect. | Re-enter password. |
| **ERR_AUTH_02** | User login failed. | **Login Failed**<br>Invalid email or password. Please try again. | Check credentials and retry. |
| **ERR_AUTH_03** | 2FA verification failed. | **Verification Failed**<br>The 2FA code you entered is incorrect or has expired. | Re-enter 2FA code. |
| **ERR_AUTH_04** | Session expired. | **Session Expired**<br>Your login session has expired. Please sign in again. | Sign in again. |

### 2.3. Permission Errors

| Error Code | Situation | Error Message (Title & Body) | Recommended Action |
| :--------- | :-------- | :--------------------------- | :----------------- |
| **ERR_PERM_01** | Screen recording permission missing (macOS). | **Permission Required**<br>RemoteDesk needs Screen Recording permission to share your screen. | Open System Settings and grant permission. |
| **ERR_PERM_02** | Accessibility permission missing (macOS/Linux). | **Permission Required**<br>RemoteDesk needs Accessibility permission to allow remote control. | Open System Settings and grant permission. |
| **ERR_PERM_03** | Action not allowed by policy. | **Action Restricted**<br>This action is restricted by your administrator's policy. | Contact your administrator. |

### 2.4. Application and System Errors

| Error Code | Situation | Error Message (Title & Body) | Recommended Action |
| :--------- | :-------- | :--------------------------- | :----------------- |
| **ERR_SYS_01** | General application error. | **An Error Occurred**<br>Something went wrong. Please restart the application and try again. | Restart application. |
| **ERR_SYS_02** | Update failed. | **Update Failed**<br>Could not download or install the latest update. | Check network or try manual update. |
| **ERR_SYS_03** | Out of disk space. | **Disk Full**<br>There is not enough disk space to complete this action. | Free up some disk space. |

## 3. Implementation Guidelines

*   **Consistent UI:** Use a standardized error dialog or notification component for all errors.
*   **Include Error Codes:** Always include the error code (e.g., ERR_CONN_01) to help support teams identify the issue.
*   **Logging:** Log all errors with their codes and relevant context (refer to `audit-log-structure.md`).
*   **Localization:** Ensure all error messages are properly localized (refer to `locale-contract.md`).

## 4. Related Documents

*   `desktop-ux-session-toolbar.md`
*   `desktop-ux-first-run.md`
*   `desktop-ux-settings.md`
*   `desktop-ux-accessibility.md`
*   `support-diagnostics-guide.md`

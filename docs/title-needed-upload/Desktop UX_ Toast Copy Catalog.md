# Desktop UX: Toast Copy Catalog

Toast notifications provide brief, non-intrusive feedback about application events and actions. This document provides a catalog of standardized toast messages for the RemoteDesk desktop application.

## 1. Principles for Toast Copy

*   **Be Brief:** Toasts should be readable at a glance.
*   **Be Informative:** Clearly state what happened or the result of an action.
*   **Use Active Voice:** "File transferred" is better than "The file has been transferred."
*   **Avoid Overuse:** Only use toasts for important or requested actions.
*   **Provide Action (Optional):** Some toasts may include a simple action (e.g., "Undo", "View").

## 2. Toast Message Catalog

### 2.1. Session and Connection

| Event | Toast Message | Type | Action (Optional) |
| :---- | :------------ | :--- | :---------------- |
| Session started | Connected to [Device Name] | Success | N/A |
| Session ended | Session disconnected | Info | N/A |
| Reconnecting | Reconnecting... | Warning | N/A |
| Connection restored | Connection restored | Success | N/A |
| Incoming request | Incoming connection from [User Name] | Info | Accept / Reject |

### 2.2. File Transfer and Clipboard

| Event | Toast Message | Type | Action (Optional) |
| :---- | :------------ | :--- | :---------------- |
| File transfer started | Sending [File Name]... | Info | Cancel |
| File transfer complete | [File Name] received successfully | Success | Open Folder |
| File transfer failed | Failed to send [File Name] | Error | Retry |
| Clipboard synced | Clipboard synced from remote | Success | N/A |
| Clipboard sync failed | Failed to sync clipboard | Error | N/A |

### 2.3. Settings and Configuration

| Event | Toast Message | Type | Action (Optional) |
| :---- | :------------ | :--- | :---------------- |
| Settings saved | Settings updated successfully | Success | N/A |
| Update available | A new update is available | Info | Update Now |
| Update downloaded | Update ready to install | Success | Restart |
| Permission granted | [Permission Name] granted | Success | N/A |

### 2.4. Account and Security

| Event | Toast Message | Type | Action (Optional) |
| :---- | :------------ | :--- | :---------------- |
| Login successful | Signed in as [User Email] | Success | N/A |
| Password changed | Password updated successfully | Success | N/A |
| MFA enabled | 2FA has been enabled | Success | N/A |
| Device authorized | This device is now authorized | Success | N/A |

## 3. Implementation Guidelines

*   **Standardized Component:** Use a consistent toast component with appropriate styling for different types (Success, Info, Warning, Error).
*   **Auto-Dismiss:** Toasts should automatically disappear after a few seconds (e.g., 3-5 seconds), except for critical errors or those requiring user action.
*   **Positioning:** Consistently place toasts in a predictable location (e.g., bottom-right or top-center).
*   **Stacking:** Handle multiple toasts gracefully by stacking them or showing them in sequence.
*   **Accessibility:** Ensure toasts are announced by screen readers.

## 4. Related Documents

*   `desktop-ux-session-toolbar.md`
*   `desktop-ux-first-run.md`
*   `desktop-ux-error-copy.md`
*   `desktop-ux-accessibility.md`

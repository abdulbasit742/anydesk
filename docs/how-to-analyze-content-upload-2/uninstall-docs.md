# Windows Uninstall Documentation for RemoteDesk

This document details the uninstallation process for RemoteDesk on Windows, ensuring a clean removal of the application.

## Overview
The RemoteDesk uninstaller is designed to remove all application files, registry entries, and other associated components installed by the RemoteDesk setup program. A clean uninstallation is crucial for user satisfaction and system hygiene.

## Uninstallation Methods
Users can uninstall RemoteDesk using standard Windows procedures:

### 1. Via "Add or Remove Programs" (Windows Settings)
1. Open **Settings** (Windows Key + I).
2. Navigate to **Apps** > **Apps & features**.
3. Locate **RemoteDesk** in the list of installed applications.
4. Click on **RemoteDesk** and then select **Uninstall**.
5. Follow the prompts of the RemoteDesk uninstallation wizard.

### 2. Via "Programs and Features" (Control Panel)
1. Open **Control Panel**.
2. Go to **Programs** > **Programs and Features**.
3. Locate **RemoteDesk** in the list.
4. Right-click on **RemoteDesk** and select **Uninstall/Change**.
5. Follow the prompts of the RemoteDesk uninstallation wizard.

### 3. Via Start Menu (if available)
Some installers provide an uninstall shortcut directly in the Start Menu folder for the application.
1. Open the **Start Menu**.
2. Navigate to the **RemoteDesk** program group.
3. Look for an **Uninstall RemoteDesk** shortcut and click it.
4. Follow the prompts of the RemoteDesk uninstallation wizard.

## Uninstallation Process (Uninstaller Wizard)
Upon launching the uninstaller, the user will typically encounter the following steps:
1. **Confirmation**: A prompt asking the user to confirm they wish to uninstall RemoteDesk.
2. **Removal**: The uninstaller removes application files, shortcuts, and registry entries.
3. **Completion**: A message indicating that RemoteDesk has been successfully uninstalled.

## What the Uninstaller Removes
The uninstaller should aim to remove:
- All files installed in the application directory (e.g., `C:\Program Files\RemoteDesk`).
- All shortcuts created in the Start Menu and on the Desktop.
- All registry entries specific to RemoteDesk (e.g., under `HKEY_LOCAL_MACHINE\SOFTWARE\RemoteDesk` or `HKEY_CURRENT_USER\SOFTWARE\RemoteDesk`).
- Windows Firewall rules created by the installer.
- Any services registered by RemoteDesk.
- Application data stored in `AppData` (optionally, with user confirmation, as this might contain user-specific settings or logs).

## What the Uninstaller *May Not* Remove (and why)
- **User-generated content**: Documents, recordings, or custom configurations created by the user outside the application's default installation directory are typically left intact.
- **Shared components**: If RemoteDesk shares common runtime libraries with other applications, these might not be removed to avoid breaking other software.
- **Crash dumps/Log files**: Depending on policy, some diagnostic files might be left for post-uninstallation analysis, though ideally, these should be cleaned up or offered for removal.

## Testing the Uninstallation
- Verify that all application files are removed.
- Check that Start Menu and Desktop shortcuts are gone.
- Confirm that relevant registry entries are deleted.
- Ensure firewall rules are removed.
- Test uninstallation on different Windows versions and user privilege levels.
- Verify that the system remains stable after uninstallation.

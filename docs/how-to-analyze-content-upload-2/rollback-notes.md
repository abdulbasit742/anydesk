# Rollback Notes for RemoteDesk Auto-Update System

This document outlines the strategy and procedures for rolling back RemoteDesk application updates in case of critical issues.

## Overview
A robust auto-update system must include a reliable rollback mechanism. This ensures that if a new update introduces severe bugs, performance regressions, or security vulnerabilities, users can quickly revert to a known stable version, minimizing downtime and impact.

## Rollback Strategy

### 1. Automatic Rollback (Client-Side)
- **Trigger**: If an update fails during installation or if the application crashes immediately after an update, the client should attempt to revert to the previously installed working version.
- **Mechanism**: The auto-updater should keep a backup of the previous working application version before applying a new update. If the update fails, it restores this backup.
- **Limitations**: This is primarily for installation failures or immediate post-update crashes. It cannot address issues that manifest later or require server-side intervention.

### 2. Manual Rollback (User-Initiated)
- **Trigger**: Users encounter critical issues with a new update and wish to revert to a previous version.
- **Mechanism**: The application UI could provide an option to 
"Revert to Previous Version" if a backup is available. Alternatively, users can manually download and install an older version from the RemoteDesk website.
- **Limitations**: Requires user action and awareness.

### 3. Server-Initiated Rollback (Admin-Initiated)
- **Trigger**: A critical issue is identified in a widely distributed update, and administrators need to force all affected clients to revert to a stable version.
- **Mechanism**: Administrators update the release metadata on the update server to point to an older, stable version. The auto-update client, upon its next check, will detect this "downgrade" and apply it.
- **Considerations**: The client updater must be capable of handling downgrades, not just upgrades. This might require specific logic to handle potential data migration issues if the newer version altered local data structures.

## Data Migration and Compatibility
- **Forward Compatibility**: Updates should strive to be forward-compatible with local data.
- **Backward Compatibility**: Downgrades can be problematic if a newer version migrated local data (e.g., settings, logs) to a new format that the older version cannot read.
- **Mitigation**:
  - Avoid breaking changes to local data structures whenever possible.
  - If a breaking change is necessary, the update process should back up the old data format before migrating. A rollback would then restore this old data.
  - Alternatively, design the application to gracefully handle newer data formats (e.g., ignoring unknown fields) or provide a migration script for downgrades.

## Rollback Procedure (Server-Initiated)
1. **Identify Issue**: A critical issue is confirmed in version `1.2.3`.
2. **Determine Stable Version**: Identify the last known stable version, e.g., `1.2.2`.
3. **Update Metadata**: Modify the `update.json` file on the update server for the affected channel(s).
   - Change `version` to `1.2.2`.
   - Update `url`, `sha256`, and `size` to point to the `1.2.2` binaries.
   - Add a note explaining the rollback.
4. **Client Detection**: Clients checking for updates will see the "new" version is `1.2.2`.
5. **Client Downgrade**: The client downloads and installs `1.2.2`, effectively rolling back.

## Testing Rollbacks
- **Simulate Update Failure**: Test the client's automatic rollback mechanism by intentionally causing an update installation to fail.
- **Simulate Server Rollback**: Test the server-initiated rollback by publishing a newer version, then changing the metadata to point to an older version, and verifying the client downgrades successfully.
- **Data Integrity**: Verify that local application data remains intact and usable after a rollback.

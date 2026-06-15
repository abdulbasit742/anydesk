# Release Metadata Documentation for RemoteDesk Auto-Update

This document defines the structure and content of the release metadata files used by the RemoteDesk auto-update system.

## Overview
Release metadata files provide essential information about each new version of the RemoteDesk application. The auto-update client uses this metadata to determine if an update is available, what version it is, where to download it, and to display release notes to the user.

## Metadata File Format
The release metadata will be stored in JSON format. A single JSON file will typically contain information for a specific platform and channel, or a central file might reference platform-specific metadata.

### Example `update.json` Structure
```json
{
  "version": "1.2.3",
  "channel": "stable",
  "releaseDate": "2023-10-27T10:00:00Z",
  "critical": false, // true if this is a critical security update or bug fix
  "minimumVersion": "1.2.0", // Minimum version required to update from
  "notes": "- Fixed critical security vulnerability.\n- Improved connection stability.\n- Added new feature X.",
  "platforms": {
    "windows-x64": {
      "url": "https://downloads.remotedesk.com/stable/RemoteDesk-1.2.3-win-x64.exe",
      "sha256": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "size": 123456789 // in bytes
    },
    "macos-x64": {
      "url": "https://downloads.remotedesk.com/stable/RemoteDesk-1.2.3-mac-x64.dmg",
      "sha256": "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
      "size": 98765432
    },
    "linux-x64": {
      "url": "https://downloads.remotedesk.com/stable/RemoteDesk-1.2.3-linux-x64.AppImage",
      "sha256": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
      "size": 76543210
    }
  }
}
```

## Fields Explanation
- **`version` (string, required)**: The semantic version number of the release (e.g., "1.2.3").
- **`channel` (string, required)**: The update channel this release belongs to (e.g., "stable", "beta", "alpha").
- **`releaseDate` (string, required)**: ISO 8601 formatted timestamp of when the release was published.
- **`critical` (boolean, optional)**: `true` if this is a critical update (e.g., security fix) that should be highly prioritized for installation. Defaults to `false`.
- **`minimumVersion` (string, optional)**: Specifies the minimum version of the application from which this update can be applied. Useful for delta updates or preventing updates from very old, incompatible versions.
- **`notes` (string, required)**: Release notes for the update. Markdown formatting is recommended, with newline characters (`\n`) for line breaks.
- **`platforms` (object, required)**: An object where keys are platform identifiers (e.g., "windows-x64", "macos-x64", "linux-x64") and values are objects containing platform-specific download information.
  - **`url` (string, required)**: The direct HTTPS URL to download the update package for that specific platform.
  - **`sha256` (string, required)**: The SHA256 checksum of the update package. Used by the client to verify the integrity of the downloaded file.
  - **`size` (number, required)**: The size of the update package in bytes.

## Hosting and Access
- Metadata files will be hosted on a secure, highly available web server (e.g., S3 bucket with CloudFront CDN).
- The update client will fetch this JSON file from a predefined endpoint (e.g., `https://updates.remotedesk.com/latest.json?channel=stable&platform=windows-x64`).

## Generation
This metadata file should be automatically generated as part of the CI/CD release pipeline, ensuring accuracy and consistency for each build.

## Security Considerations
- **Integrity**: The `sha256` checksum is crucial for verifying that the downloaded update package has not been tampered with.
- **Authenticity**: Ensure the metadata itself is served over HTTPS from a trusted domain.
- **Rollback**: The metadata should support identifying previous stable versions for potential rollbacks.

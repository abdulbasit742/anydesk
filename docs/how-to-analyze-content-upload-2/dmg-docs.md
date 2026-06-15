# macOS DMG Documentation

This document outlines the process and best practices for creating a Disk Image (DMG) for the RemoteDesk macOS application.

## Overview
A DMG is the standard method for distributing macOS applications outside of the Mac App Store. It provides a user-friendly drag-and-drop installation experience.

## Key Components of a DMG
- **Application Bundle**: The `.app` file containing the RemoteDesk application.
- **Applications Folder Alias**: A symbolic link to the `/Applications` directory, allowing users to easily drag the app for installation.
- **Background Image**: A custom background image for the DMG window to enhance branding.
- **License Agreement**: An optional EULA that users must accept before accessing the DMG contents.
- **Volume Icon**: A custom icon for the mounted DMG volume.

## Creation Process (using `create-dmg` or similar tools)
1. **Prepare Application**: Ensure the `RemoteDesk.app` bundle is properly signed and notarized.
2. **Create a Temporary Directory**: Place the `.app` bundle and the Applications folder alias inside a temporary directory.
3. **Design Background**: Create a high-resolution background image (e.g., `background.png`).
4. **Generate DMG**: Use a tool like `create-dmg` (a shell script wrapper around `hdiutil` and `diskutil`) to generate the DMG.

```bash
#!/bin/bash

APP_NAME="RemoteDesk"
APP_BUNDLE="${APP_NAME}.app"
DMG_NAME="${APP_NAME}-Installer"
BACKGROUND_IMG="path/to/background.png"
VOLUME_ICON="path/to/volume_icon.icns"

# Ensure the app is signed and notarized before this step

# Create a temporary directory for DMG contents
mkdir -p "temp_dmg_content"
cp -R "path/to/${APP_BUNDLE}" "temp_dmg_content/"
ln -s /Applications "temp_dmg_content/Applications"

# Use create-dmg to build the DMG
create-dmg \
  --volname "${APP_NAME}" \
  --volicon "${VOLUME_ICON}" \
  --background "${BACKGROUND_IMG}" \
  --window-pos 200 120 \
  --window-size 800 500 \
  --icon-size 100 \
  --icon "${APP_BUNDLE}" 200 190 \
  --hide-extension "${APP_BUNDLE}" \
  --icon "Applications" 550 190 \
  --hide-extension "Applications" \
  --app-drop-link 550 190 \
  "${DMG_NAME}.dmg" \
  "temp_dmg_content/"

# Clean up temporary directory
rm -rf "temp_dmg_content"
```

## Code Signing the DMG
After creation, the DMG itself should be signed to ensure its integrity and authenticity.

```bash
codesign --force --options runtime --sign "Developer ID Application: Your Company (XXXXXXXXXX)" "${DMG_NAME}.dmg"
```

## Notarization
While the application bundle inside the DMG must be notarized, the DMG itself does not require separate notarization, but it's good practice to sign it. The notarization of the `.app` bundle ensures that macOS Gatekeeper allows it to run.

## Testing
- Mount the DMG and verify its contents.
- Drag the application to the Applications folder and launch it.
- Verify the application runs correctly after installation.
- Test on different macOS versions.


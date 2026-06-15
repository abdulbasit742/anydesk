# RemoteDesk Installer Readiness Checklist

This checklist ensures that all necessary steps and configurations are in place before building and distributing the RemoteDesk desktop client installers for Windows, macOS, and Linux.

## General Requirements
- [ ] Application version is correctly bumped in `package.json` and other relevant configuration files.
- [ ] Release notes are finalized and published.
- [ ] All automated tests (unit, integration, E2E) pass successfully.
- [ ] Manual QA testing is complete and signed off.
- [ ] Security scans (SAST, DAST) show no critical or high vulnerabilities.

## Windows Distribution
- [ ] **NSIS Configuration**: `nsis-config.nsi` is reviewed and updated with the correct application name, version, and publisher details.
- [ ] **Code Signing**:
  - [ ] Valid EV Code Signing Certificate is available.
  - [ ] Build pipeline is configured to sign the `.exe` installer.
  - [ ] Build pipeline is configured to sign all internal `.dll` and `.exe` files.
- [ ] **Firewall Rules**: Installer correctly prompts or configures necessary Windows Firewall rules for incoming connections (if applicable).
- [ ] **Permissions**: Documentation is clear on how users should grant accessibility permissions if required for remote control.
- [ ] **Uninstaller**: Uninstaller cleanly removes all application files, registry keys, and user data (or prompts the user).
- [ ] **Testing**: Installer tested on Windows 10 and Windows 11 (various builds).

## macOS Distribution
- [ ] **DMG Configuration**: DMG background image, icon layout, and volume name are correctly configured.
- [ ] **Code Signing**:
  - [ ] Valid Apple Developer ID Application certificate is available.
  - [ ] Build pipeline is configured to sign the `.app` bundle.
- [ ] **Notarization**:
  - [ ] Build pipeline is configured to submit the signed app to Apple for notarization.
  - [ ] Notarization ticket is successfully stapled to the DMG.
- [ ] **Permissions (TCC)**:
  - [ ] App correctly prompts for Screen Recording permissions.
  - [ ] App correctly prompts for Accessibility permissions (for remote control).
  - [ ] Privacy prompts are clear and explain *why* the permissions are needed.
- [ ] **Testing**: Installer tested on macOS Monterey, Ventura, and Sonoma (Intel and Apple Silicon).

## Linux Distribution
- [ ] **AppImage**:
  - [ ] AppImage is built correctly with all necessary dependencies bundled.
  - [ ] Desktop integration script is included and functional.
- [ ] **Debian Package (.deb)**:
  - [ ] Control file is correctly configured with dependencies and maintainer info.
  - [ ] Post-install and pre-remove scripts function correctly.
- [ ] **Display Server Compatibility**:
  - [ ] Application behavior under X11 is verified.
  - [ ] Application behavior under Wayland is verified (and limitations are documented/handled gracefully).
- [ ] **Permissions**: Documentation is clear on how to grant necessary permissions for screen capture and input injection on various desktop environments.
- [ ] **Testing**: Tested on recent versions of Ubuntu, Fedora, and Arch Linux.

## Auto-Update System
- [ ] Update server is configured to serve the new version metadata.
- [ ] Release metadata JSON is correctly formatted and signed (if applicable).
- [ ] Auto-update client logic is tested to ensure it detects, downloads, and applies the update correctly.
- [ ] Rollback mechanism is tested and verified.

## Final Sign-off
- [ ] Release Manager: ____________________ Date: __________
- [ ] QA Lead: ____________________ Date: __________
- [ ] Security Lead: ____________________ Date: __________

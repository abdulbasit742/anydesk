# macOS Notarization Guide for RemoteDesk

This guide outlines the process of notarizing the RemoteDesk macOS application, a requirement for distributing software outside the Mac App Store on macOS Catalina and later.

## Overview
Notarization is an automated process by Apple that scans your software for malicious content and checks for code signing issues. If no issues are found, Apple issues a "ticket" that is then stapled to your application. This allows Gatekeeper to launch your application without warning users that it's from an unidentified developer.

## Prerequisites
- **Apple Developer Account**: Required to use the notarization service.
- **App-Specific Password**: Needed for `notarytool` or `altool` to authenticate with Apple's servers.
- **Code Signed Application**: Your application bundle (`.app`) must be correctly code signed with a Developer ID Application certificate and have the hardened runtime enabled.
- **Xcode Command Line Tools**: Provides the `notarytool` utility (or `altool` for older versions).

## Notarization Process (using `notarytool`)
`notarytool` is the recommended command-line tool for notarization, available with Xcode 13 and later.

1. **Archive Your Application**: Create a `.zip` archive of your signed application bundle.
   ```bash
   ditto -c -k --sequesterRsrc --keepParent "/path/to/RemoteDesk.app" "RemoteDesk.zip"
   ```
   - `--sequesterRsrc`: Preserves resource forks and Finder information.
   - `--keepParent`: Includes the parent directory in the archive, which is often desired.

2. **Upload for Notarization**: Use `notarytool` to upload the archive to Apple.
   ```bash
   xcrun notarytool submit "RemoteDesk.zip" --apple-id "your_apple_id@example.com" --team-id "XXXXXXXXXX" --password "your_app_specific_password" --wait
   ```
   - `--apple-id`: Your Apple ID email.
   - `--team-id`: Your Apple Developer Team ID.
   - `--password`: An app-specific password generated from [appleid.apple.com](https://appleid.apple.com/account/manage).
   - `--wait`: This option makes the command wait for the notarization process to complete and reports the status.

3. **Check Notarization Status (if not using `--wait`)**:
   If you don't use `--wait`, you'll get a `RequestUUID`. You can check the status later:
   ```bash
   xcrun notarytool info <RequestUUID> --apple-id "your_apple_id@example.com" --team-id "XXXXXXXXXX" --password "your_app_specific_password"
   ```

4. **Staple the Notarization Ticket**: Once notarization is successful, staple the ticket to your application.
   ```bash
   xcrun stapler staple "/path/to/RemoteDesk.app"
   ```
   Stapling embeds the notarization ticket directly into your application, so Gatekeeper can verify it even offline.

5. **Verify Stapling**: Confirm that the ticket has been successfully stapled.
   ```bash
   spctl --assess --type execute --verbose "/path/to/RemoteDesk.app"
   ```
   Look for `Source=Notarized Developer ID` in the output.

## Notarization for DMG
While the application bundle inside the DMG must be notarized, the DMG itself does not require separate notarization. However, it's good practice to sign the DMG after creation.

## Common Issues
- **Code Signing Errors**: Most notarization failures are due to incorrect code signing. Ensure all executables and bundles within your app are correctly signed with the hardened runtime.
- **Missing Entitlements**: If your app uses specific macOS features (e.g., network access, camera, microphone), ensure the correct entitlements are present.
- **Network Issues**: Ensure your build machine has internet access to communicate with Apple's notarization service.
- **App-Specific Password**: Double-check that you are using an app-specific password, not your regular Apple ID password.

## Best Practices
- **Automate Notarization**: Integrate notarization into your CI/CD pipeline.
- **Test Locally**: Thoroughly test your code-signed application locally before submitting for notarization.
- **Review Logs**: If notarization fails, download and review the notarization logs provided by Apple for detailed error information.

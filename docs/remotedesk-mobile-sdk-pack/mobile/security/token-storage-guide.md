# Secure Token Storage Guide

## iOS
- Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`.
- Disable iCloud backup for keychain item.
- Enable data protection complete.

## Android
- Use Android Keystore with AES-256-GCM.
- Require biometric auth for keystore use (strongbox if available).
- Block backup in manifest.

## Implementation
- Wrap `expo-secure-store` with encryption layer.
- Clear on logout, app uninstall, or security event.
- Auto-lock after 5 min background.

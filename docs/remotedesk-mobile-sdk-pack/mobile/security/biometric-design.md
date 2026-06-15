# Biometric Unlock Design

## Flow
1. App launch -> check `biometricEnabled` flag.
2. If enabled, prompt `expo-local-authentication`.
3. On success, decrypt token keystore key.
4. On failure 3x, fall back to password + full re-auth.

## UI
- Settings toggle with system permission request.
- Grace period: 5 minutes after backgrounding.
- Cancel biometric -> app stays locked, no data visible.

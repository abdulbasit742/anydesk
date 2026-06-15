# Mobile Auth Security Model

## Token Storage
- Access token: memory only during active session.
- Refresh token: Expo SecureStore with keychain/keystore.
- No plaintext token logging.

## Session Binding
- Tokens scoped to device fingerprint (expo-device ID).
- Rotation on every refresh; old refresh tokens invalidated server-side.

## Biometric Gate
- Optional biometric unlock before revealing RemoteDesk ID or connecting.
- Uses expo-local-authentication; falls back to PIN.

## Transport
- API: HTTPS only with certificate pinning (future).
- Signaling: WSS only; verify server certificate.

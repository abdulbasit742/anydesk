# RemoteDesk Mobile Security Model

## Threat Model

### Device Compromise
- Encrypted local storage (Keychain/Keystore)
- Biometric authentication for app access
- Auto-lock on background
- Jailbreak/root detection

### Network Attacks
- Certificate pinning
- TLS 1.3 only
- No cleartext traffic (Android: usesCleartextTraffic=false)

### Session Hijacking
- Short-lived tokens (1 hour)
- Refresh token rotation
- Device fingerprinting
- Session binding to device

## Implementation

### iOS Security
```swift
// Keychain storage
let query: [String: Any] = [
  kSecClass as String: kSecClassGenericPassword,
  kSecAttrAccount as String: "auth_token",
  kSecValueData as String: token.data(using: .utf8)!,
  kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
]
SecItemAdd(query as CFDictionary, nil)

// Biometric auth
let context = LAContext()
context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
  localizedReason: "Unlock RemoteDesk") { success, error in
  // Handle result
}
```

### Android Security
```kotlin
// Encrypted SharedPreferences
val masterKey = MasterKey.Builder(context)
  .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
  .build()

val prefs = EncryptedSharedPreferences.create(
  context,
  "secure_prefs",
  masterKey,
  EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
  EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
prefs.edit().putString("auth_token", token).apply()

// Root detection
val isRooted = RootBeer(context).isRooted
if (isRooted) {
  // Block or warn user
}
```

## Permissions
| Permission | Purpose | Required |
|------------|---------|----------|
| Camera | QR scanning | No (optional) |
| Microphone | Session audio | No (optional) |
| Photos | File transfer | No (optional) |
| Notifications | Push alerts | Yes |

## Compliance
- App Store privacy labels
- GDPR data collection disclosure
- Minimal data collection
- On-device processing where possible

# Mobile Testing Checklist

## Device Matrix
| Device | OS | Screen Size | Priority |
|--------|-----|-------------|----------|
| iPhone 15 Pro | iOS 17 | 6.1" | P0 |
| iPhone 14 | iOS 16 | 6.1" | P0 |
| iPad Pro | iPadOS 17 | 12.9" | P1 |
| Pixel 8 Pro | Android 14 | 6.7" | P0 |
| Samsung S24 | Android 14 | 6.2" | P0 |
| Xiaomi 13 | Android 13 | 6.36" | P1 |

## Functional Tests
- [ ] App launches successfully
- [ ] Login with email/password
- [ ] Biometric authentication
- [ ] QR code scanning
- [ ] Manual desk ID entry
- [ ] Session accept/reject
- [ ] Screen viewing
- [ ] Touch controls (tap, drag, pinch)
- [ ] Keyboard input
- [ ] Chat messaging
- [ ] File transfer
- [ ] Session disconnect
- [ ] Background/foreground handling
- [ ] Push notifications
- [ ] Token refresh

## Performance Tests
- [ ] App launch < 3 seconds
- [ ] Connection establish < 10 seconds
- [ ] Frame rate > 15fps on WiFi
- [ ] Battery usage < 10%/hour
- [ ] Memory usage < 200MB
- [ ] App size < 50MB

## Network Tests
- [ ] WiFi connection
- [ ] Cellular (4G/5G)
- [ ] Slow network (3G)
- [ ] Network switch (WiFi to cellular)
- [ ] Airplane mode recovery
- [ ] VPN compatibility

## Security Tests
- [ ] Jailbreak detection (iOS)
- [ ] Root detection (Android)
- [ ] Certificate pinning
- [ ] Token storage encrypted
- [ ] Screenshot prevention (optional)

## Accessibility Tests
- [ ] VoiceOver (iOS)
- [ ] TalkBack (Android)
- [ ] Dynamic type (iOS)
- [ ] Font scaling (Android)
- [ ] High contrast mode

# Mobile QA Checklist

## Device Matrix
| Device | OS | Screen | Priority |
|--------|-----|--------|----------|
| iPhone 15 | iOS 17 | 6.1" | P0 |
| iPhone 14 | iOS 16 | 6.1" | P0 |
| iPad Pro | iPadOS 17 | 12.9" | P1 |
| Pixel 8 | Android 14 | 6.2" | P0 |
| Samsung S24 | Android 14 | 6.2" | P0 |
| Xiaomi 13 | Android 13 | 6.36" | P2 |

## Functional QA
- [ ] Login works
- [ ] Device list loads
- [ ] Connect to remote desktop
- [ ] Video stream displays
- [ ] Touch input works
- [ ] Chat works
- [ ] Disconnect works
- [ ] Background/foreground handling
- [ ] Rotation handling

## Performance QA
- [ ] App launches < 3s
- [ ] Video starts < 5s
- [ ] No stutter at 15fps
- [ ] Memory < 200MB
- [ ] Battery drain < 10%/hour

## Network QA
- [ ] Works on WiFi
- [ ] Works on 4G
- [ ] Works on 5G
- [ ] Handles switching
- [ ] Reconnects automatically

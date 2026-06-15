# Mobile Testing with Emulators

## iOS Simulator
```bash
xcrun simctl list devices
xcrun simctl boot "iPhone 15 Pro"
```

## Android Emulator
```bash
emulator -avd Pixel_8_API_34
```

## CI Testing
```yaml
- name: iOS Tests
  run: xcodebuild test -scheme RemoteDesk -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

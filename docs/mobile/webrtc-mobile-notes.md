# WebRTC on Mobile Notes

## Platform Support
### iOS
- WKWebView supports WebRTC (iOS 14.3+)
- Native: WebKit framework
- Limitation: No background audio/video

### Android
- Chrome WebView supports WebRTC (Android 5+)
- Native: libwebrtc or raw API
- Better background support than iOS

## Battery Optimization
- Reduce frame rate on battery power
- Pause video when app backgrounded
- Use hardware encoding when available
- Adaptive quality based on battery level

## Network Handling
- Handle cellular/WiFi switching
- Support for varying bandwidth
- Graceful degradation on poor networks
- Reconnection logic for dropped connections

## Codec Considerations
- H.264 hardware acceleration preferred
- VP8 as fallback
- iOS: H.264 required for hardware decode
- Android: Both VP8 and H.264 supported

## Known Issues
- iOS: 16KB WebSocket limit
- Android: Bluetooth audio routing
- Both: Thermal throttling affects performance

# Mobile Architecture

## Overview
Future mobile apps (iOS/Android) will share the same backend infrastructure.

## Proposed Architecture
```
Mobile App (React Native)
  -> WebSocket (Socket.IO client)
    -> Signaling Server
      -> WebRTC peer connection
        -> Desktop/Web client
```

## Key Considerations
1. **Battery**: WebRTC is battery-intensive
2. **Background**: iOS background execution limits
3. **Screen Size**: Touch-optimized UI needed
4. **Network**: Mobile networks have higher latency
5. **Permissions**: Camera, microphone access

## API Compatibility
Current API is already mobile-ready:
- REST endpoints work over HTTP
- Socket.IO has mobile clients
- WebRTC is supported on mobile browsers

## Planned Features (MVP)
- [ ] Connect to remote desktop (viewer only)
- [ ] Accept incoming connections (host)
- [ ] Basic remote control (touch input)
- [ ] Chat
- [ ] File transfer (download only)

## Input Mapping
| Touch | Desktop Action |
|-------|---------------|
| Single tap | Left click |
| Long press | Right click |
| Two-finger drag | Scroll |
| Pinch | Zoom |
| Drag | Mouse move |

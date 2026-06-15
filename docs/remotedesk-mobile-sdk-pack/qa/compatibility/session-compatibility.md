# Desktop-Web-Mobile Session Compatibility Guide

## Protocol
- WebRTC offer/answer/ICE identical across clients.
- Data channel messages versioned (v1 current).
- Socket events names locked; no client changes allowed.

## Host Capabilities
- Desktop: full host (screen capture + input injection).
- Web: host limited to browser tab capture.
- Mobile: host not supported (no screen capture API).

## Client Capabilities
- All clients can receive video and send input.
- Mobile touch input mapped to mouse events.
- Web/desktop send native mouse/keyboard.

## Quality
- Desktop: up to 4K @ 60fps.
- Web: up to 1080p @ 30fps (browser dependent).
- Mobile: up to 1080p @ 30fps (hardware dependent).

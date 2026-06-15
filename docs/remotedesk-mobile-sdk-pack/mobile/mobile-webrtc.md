# Mobile WebRTC Design

## Architecture
- `WebRTCService` wraps `RTCPeerConnection` from `react-native-webrtc`
- `SignalingClient` uses Socket.IO with existing event names
- Stats parsed every 3s for quality badge

## Dependencies
- `react-native-webrtc`: ^124.0.0
- `socket.io-client`: ^4.7.0

## TURN Config
- STUN: Google public
- TURN: configurable via env vars
- ICE transport policy: `all` (fallback to `relay` if needed)

## Reconnect
- Signaling: exponential backoff, max 5 attempts
- WebRTC: full renegotiation on ICE failure

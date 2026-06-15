# WebRTC Resilience

## Components

### ICE Restart Flow
- Automatic ICE restart on connection failure
- Configurable max attempts and backoff
- State tracking for UI feedback

### TURN Fallback Diagnostics
- Detects when TURN relay is needed
- Measures candidate types gathered
- Provides connection recommendation

### Stats Monitor
- Periodic getStats() polling (3s default)
- Bitrate, packet loss, RTT tracking
- Quality assessment (excellent -> critical)

### Bandwidth Warnings
- User-facing warnings on degradation
- Cooldown to prevent warning spam
- Auto-recovery detection

### Network Reconnect Manager
- Listens for online/offline events
- Debounced reconnection triggers
- State tracking for UX

### Peer Cleanup Hardening
- Safely closes all tracks and streams
- Reports cleanup status
- Handles errors gracefully

## Usage

```typescript
const service = new WebRTCResilienceService();
service.attach(peerConnection);

// On network change
service.networkReconnect.start(() => {
  service.iceRestart.restart(peerConnection);
});

// On component unmount
const report = service.cleanup(peerConnection);
```

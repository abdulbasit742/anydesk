# Desktop Reliability

## Components
- **ReconnectManager**: Exponential backoff reconnection
- **IceRestartHelper**: ICE restart on connection failure
- **NetworkQualityMonitor**: Monitor network conditions
- **SessionWatchdog**: Detect dead connections via ping/pong
- **CaptureRestartHelper**: Restart screen capture on failure
- **CrashCleanup**: Cleanup on unexpected termination
- **DiagnosticsExport**: Export system diagnostics

## Usage
```typescript
const reconnect = new ReconnectManager();
reconnect.on('connected', () => console.log('Reconnected'));
reconnect.start();
```

## Configuration
All components accept partial config with sensible defaults.

## Testing
Components use EventEmitter for testability.

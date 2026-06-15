# Diagnostics Export

## Data Collected
- System info (OS, arch, memory)
- Network interfaces
- WebRTC statistics
- Recent application logs
- Session history

## Usage
```typescript
const diagnostics = await collectDiagnostics();
// Add WebRTC stats
diagnostics.webrtcStats = await pc.getStats();
const filePath = exportDiagnosticsToFile(diagnostics);
```

## Privacy
Diagnostics do NOT include:
- Screen content
- Keystrokes
- Clipboard data
- Personal files

# Desktop App Development Guide

## Architecture
- Main process: Node.js/Electron
- Renderer process: React
- IPC for communication

## IPC Pattern
### Main -> Renderer
```typescript
// Main
mainWindow.webContents.send('event:name', data);

// Renderer
ipcRenderer.on('event:name', (event, data) => {
  console.log(data);
});
```

### Renderer -> Main
```typescript
// Renderer
const result = await ipcRenderer.invoke('channel', data);

// Main
ipcMain.handle('channel', async (event, data) => {
  return processData(data);
});
```

## Screen Capture
```typescript
// Get sources
const sources = await desktopCapturer.getSources({
  types: ['screen', 'window'],
  thumbnailSize: { width: 320, height: 240 },
});

// Get stream
const stream = await navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: source.id,
    },
  } as any,
});
```

## Building
```bash
# Development
npm run dev:desktop

# Build
npm run build:desktop

# Package
npm run package:desktop

# All platforms
npm run package:desktop:all
```

## Auto-Updater
```typescript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

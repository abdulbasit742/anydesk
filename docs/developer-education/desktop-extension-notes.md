# RemoteDesk Desktop Extension Notes

## Electron Architecture
```
Main Process (Node.js)
  ├── Window Management
  ├── Native APIs
  ├── Auto-updater
  └── IPC Bridge

Renderer Process (Chromium)
  ├── React UI
  ├── WebRTC
  └── IPC Calls

Preload Script
  └── Secure IPC Bridge
```

## Key APIs

### Screen Capture (Main Process)
```typescript
import { desktopCapturer } from "electron";

async function getScreenSources() {
  return desktopCapturer.getSources({
    types: ["screen", "window"],
    thumbnailSize: { width: 320, height: 240 }
  });
}
```

### IPC Communication
```typescript
// Preload
contextBridge.exposeInMainWorld("electronAPI", {
  getSources: () => ipcRenderer.invoke("get-sources"),
  onSessionRequest: (cb) => ipcRenderer.on("session-request", cb),
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
});

// Renderer
const sources = await window.electronAPI.getSources();

// Main
ipcMain.handle("get-sources", async () => {
  return desktopCapturer.getSources({ types: ["screen", "window"] });
});
```

### Auto-Updater
```typescript
import { autoUpdater } from "electron-updater";

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on("update-available", () => {
  console.log("Update available");
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
```

## Building
```bash
# Development
npm run dev

# Build for platform
npm run build:win
npm run build:mac
npm run build:linux

# Package
npm run dist
```

## Security Considerations
- ContextIsolation: true
- EnableRemoteModule: false
- NodeIntegration: false
- Sandboxed renderer
- CSP headers
- Code signing (Windows, macOS)

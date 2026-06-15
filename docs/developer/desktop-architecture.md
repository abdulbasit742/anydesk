# Desktop Architecture

## Electron Structure
```
Main Process (Node.js)
  -> BrowserWindow
    -> Renderer Process (React)
      -> Preload Bridge (secure IPC)
        -> Main Process APIs
```

## Main Process
Entry: `apps/desktop/src/main.ts`
Responsibilities:
- Window management
- Native APIs (capture, dialog, screen)
- Auto-updater
- System tray

## Renderer Process
Entry: `apps/desktop/src/renderer/main.tsx`
Framework: React + Vite

## IPC Channels
| Channel | Direction | Purpose |
|---------|-----------|---------|
| capture:getSources | R->M | Get screen/window sources |
| dialog:showOpen | R->M | Show file open dialog |
| dialog:showSave | R->M | Show file save dialog |
| screen:getSize | R->M | Get screen dimensions |
| session:request | M->R | Incoming session request |

## WebRTC Flow
1. Desktop registers with socket server
2. On session request: show accept/reject dialog
3. On accept: start screen capture
4. Create peer connection
5. Exchange offer/answer via Socket.IO
6. Stream video track to peer
7. On disconnect: stop capture, close peer

## State Management
Zustand store for:
- Session state
- Device info
- Settings
- Connection quality

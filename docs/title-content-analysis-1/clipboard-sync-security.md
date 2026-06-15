# Clipboard Sync Security Boundary

This document outlines the security considerations and boundary design for the clipboard synchronization feature in RemoteDesk.

## Core Principles

1.  **Disabled by Default**: Clipboard synchronization is disabled by default and requires explicit opt-in from both the host and viewer.
2.  **Mutual Consent**: Both the host and viewer must consent to enable clipboard sync. If either party revokes consent, sync is disabled.
3.  **Size Limits**: All clipboard data (currently text-only) is subject to strict size limits to prevent resource exhaustion and potential denial-of-service attacks.
4.  **Renderer Isolation**: The Electron renderer process (where the UI runs) does not have direct access to the system clipboard. All clipboard operations are mediated by the Electron main process via Inter-Process Communication (IPC).
5.  **Input Sanitization**: While currently text-only, any future additions of richer clipboard formats will require rigorous input sanitization to prevent injection attacks or malformed data processing.
6.  **Duplicate Prevention**: Mechanisms are in place to prevent redundant clipboard updates, reducing unnecessary processing and potential loops.

## IPC Design for Clipboard Access

Clipboard operations are handled exclusively by the Electron main process. The renderer process communicates its intent to read or write clipboard data via secure IPC channels. This ensures that the renderer, which can be more vulnerable to compromise, never directly interacts with sensitive system APIs.

### `preload/clipboard/index.ts`

The preload script exposes a limited, sandboxed API to the renderer process. This API acts as a bridge, invoking specific IPC handlers in the main process.

```typescript
// Example from preload script
contextBridge.exposeInMainWorld(
  'clipboardAPI',
  {
    readClipboard: () => ipcRenderer.invoke('clipboard:read'),
    writeClipboard: (message: ClipboardMessage) => ipcRenderer.invoke('clipboard:write', message),
    // ... other handlers
  }
);
```

### `main/clipboard/index.ts`

The main process contains the actual logic for interacting with the system clipboard. It enforces all security policies, including permission checks, size validation, and duplicate prevention, before performing any read or write operations.

```typescript
// Example from main process
ipcMain.handle('clipboard:write', async (_event, message: ClipboardMessage) => {
  if (!clipboardSyncEnabled) {
    return false; // Permission denied
  }
  if (!validateClipboardMessageSize(message)) {
    return false; // Size limit exceeded
  }
  // ... perform write operation
});
```

## Data Flow and Validation

1.  **Renderer Request**: The renderer process requests a clipboard operation (read/write) via the `clipboardAPI` exposed by the preload script.
2.  **IPC Invocation**: The preload script sends an IPC message to the main process.
3.  **Main Process Validation**: The main process receives the IPC message and performs the following checks:
    *   **Permission Check**: Verifies if clipboard sync is currently enabled by both parties.
    *   **Size Validation**: Ensures the data adheres to predefined size limits.
    *   **Duplicate Check**: Prevents processing of identical, recently handled clipboard content.
4.  **System Clipboard Interaction**: If all checks pass, the main process interacts with the native system clipboard.
5.  **Renderer Notification**: Upon successful write (or read), the main process may notify the renderer (and potentially the remote peer via signaling server) of the update.

## Future Considerations

*   **Rich Text/File Support**: Expanding clipboard sync to include rich text or files will require significantly more complex sanitization, type validation, and potentially separate IPC channels with stricter controls.
*   **Encryption**: While data channel communication is typically encrypted, ensuring end-to-end encryption specifically for clipboard content could be an enhancement.
*   **Auditing/Logging**: Implementing robust logging for clipboard operations for security auditing purposes.

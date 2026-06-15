# File Transfer IPC Design

## Architecture

```
┌─────────────────┐      IPC       ┌──────────────────┐
│   Renderer      │ ◄────────────► │   Main Process   │
│  (React App)    │                │  (Node.js/Electron)│
│                 │                │                  │
│ - FileTransfer  │                │ - IPC Handlers   │
│   Panel UI      │                │ - FS Operations  │
│ - ChunkAssembly │                │ - Dialogs        │
│ - Progress      │                │ - Temp Files     │
└─────────────────┘                └──────────────────┘
```

**Critical Rule**: Renderer never accesses `fs`, `path`, or `dialog` directly.

## IPC Channels

### Renderer → Main

| Channel | Payload | Returns |
|---------|---------|---------|
| `ft:showSaveDialog` | `{ filename, defaultPath? }` | `{ canceled, filePath }` |
| `ft:showOpenDialog` | `{ multiple? }` | `{ canceled, filePaths }` |
| `ft:getFileInfo` | `filePath: string` | `{ exists, size, isFile, lastModified }` |
| `ft:readChunk` | `{ filePath, offset, length }` | `{ success, data?, bytesRead?, error? }` |
| `ft:writeChunk` | `{ transferId, filePath, chunkData, offset }` | `{ success, bytesWritten?, error? }` |
| `ft:finalizeFile` | `{ transferId, finalPath }` | `{ success, filePath?, error? }` |

### Flow Diagrams

#### Sending a File

```
Renderer                          Main
  │                                 │
  │  ft:showOpenDialog ────────────►│
  │◄──────── { filePaths } ─────────│
  │                                 │
  │  Read file via File API         │
  │  (Browser API - no IPC needed)  │
  │                                 │
  │  Calculate hash                 │
  │  Send ft:offer via DC           │
  │                                 │
  │  ft:readChunk (if needed) ─────►│
  │◄──────── { data } ──────────────│
  │                                 │
  │  Send chunks via DC             │
```

#### Receiving a File

```
Renderer                          Main
  │                                 │
  │  Receive ft:offer via DC       │
  │                                 │
  │  ft:showSaveDialog ────────────►│
  │◄──────── { filePath } ──────────│
  │                                 │
  │  Receive ft:chunk via DC       │
  │                                 │
  │  ft:writeChunk ────────────────►│
  │◄──────── { success } ───────────│
  │                                 │
  │  Receive ft:complete           │
  │                                 │
  │  ft:finalizeFile ──────────────►│
  │◄──────── { filePath } ──────────│
```

## Security Considerations

### Path Validation

Main process MUST validate all paths:

```typescript
function validatePath(filePath: string): boolean {
  // 1. Must be absolute
  if (!path.isAbsolute(filePath)) return false;
  
  // 2. Must be under allowed directory (no system paths)
  const allowedRoots = [app.getPath('downloads'), app.getPath('documents')];
  const isAllowed = allowedRoots.some(root => filePath.startsWith(root));
  
  // 3. No symlinks in path
  // 4. No path traversal
  const resolved = path.resolve(filePath);
  if (resolved !== filePath) return false;
  
  return true;
}
```

### Temp File Security

```typescript
// Temp files are:
// 1. Created with restricted permissions (0o600)
// 2. Stored in OS temp directory
// 3. Named with transferId (not original filename)
// 4. Cleaned up on app quit or finalize error
```

## Error Handling

| Error | Renderer Action | Main Action |
|-------|----------------|-------------|
| Read failure | Mark transfer failed | Log error |
| Write failure | Request pause/resume | Clean up temp file |
| Disk full | Notify user | Stop writing |
| Path invalid | Show error | Reject operation |
| Timeout | Cancel transfer | Clean up |

## Performance Notes

- Chunk reads use `fs.promises.open` + `fd.read` for efficiency
- Temp writes are buffered; flush every N chunks
- Final rename is atomic (no partial files)
- Parallel chunk reads for large files (up to 3 concurrent)

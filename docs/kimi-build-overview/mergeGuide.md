# Merge Guide

## How to Integrate This Production Pack

## Files Safe to Copy Directly

These files are self-contained and require no modification:

| File | Reason |
|------|--------|
| `packages/shared/src/remoteInput/*.ts` | Pure types and serialization - no dependencies |
| `packages/shared/src/permissions/*.ts` | Pure types and constants |
| `packages/shared/src/clipboard/*.ts` | Pure types and protocol logic |
| `packages/shared/src/fileTransfer/*.ts` | Pure types and protocol logic |
| `tests/**/*.test.ts` | Self-contained unit tests |
| `docs/*.md` | Documentation only |
| `apps/desktop/src/main/inputExecution/platformNotes.md` | Reference docs |
| `apps/desktop/src/main/inputExecution/*Notes.md` | Reference docs |

## Files Requiring Review

These files need integration with your existing codebase:

| File | Required Changes |
|------|-----------------|
| `RemoteInputProvider.tsx` | Integrate with your existing `SessionDataChannel` type |
| `useRemoteInput.ts` | Connect to your actual WebRTC/data channel service |
| `useHostInputControl.ts` | Provide actual `InputExecutor` implementation |
| `captureMouse.ts` | Review event listener approach vs your existing patterns |
| `captureKeyboard.ts` | Review blocked keys list against your app's shortcuts |
| `RemoteInputContext` | Integrate with your React context/provider hierarchy |
| `clipboardService.ts` | Connect to Electron clipboard API in `window.electron` |
| `FileTransferPanel.tsx` | Style with your existing component library |
| `PermissionConsentModal.tsx` | Style with your existing component library |

## Files Requiring Significant Integration

### Main Process Input Execution

**Path**: `apps/desktop/src/main/inputExecution/abstractExecutor.ts`

This needs:
1. A native module for OS input injection (see platform notes)
2. IPC handlers in `main.ts` to receive input events from renderer
3. Permission checks before executing input

### File Transfer IPC

**Path**: `apps/desktop/src/main/fileTransfer/ipcHandlers.ts`

This needs:
1. Registration in your main process startup
2. Temp directory configuration
3. Integration with your `browserWindow` instance

### Preload Script

**Path**: `apps/desktop/src/preload/fileTransfer.ts`

This needs:
1. Import into your existing preload script
2. `contextIsolation` compatibility check

## Integration Order

```
1. Copy shared types (packages/shared/src/*)
   └── Zero dependencies, safe first step

2. Add tests (tests/)
   └── Verify against your existing code

3. Integrate remote input capture
   └── Connect to your WebRTC data channel

4. Integrate permission system
   └── Add PermissionProvider to React tree

5. Integrate clipboard sync
   └── Add Electron clipboard API bridge

6. Integrate file transfer
   └── Add IPC handlers + preload APIs

7. Add main process input execution
   └── This is the hardest part - requires native module
```

## TypeScript Strict Mode

All files are written for TypeScript strict mode. If your project uses relaxed settings:
- Remove `as const` assertions if needed
- Add `// @ts-ignore` for strict null checks if your config differs

## Breaking Changes to Check

1. **Event names**: Verify `RemoteInputMessageType`, `PermissionMessageType`, `ClipboardMessageType`, `FileTransferMessageType` don't conflict with your existing events
2. **IPC channel names**: Verify `InputExecutionChannels` and `FileTransferIPCChannels` don't conflict
3. **Window.electron**: The clipboard and file transfer code expects `window.electron` to be defined by your preload script

## Testing After Merge

```bash
# 1. Type check
cd packages/shared && tsc --noEmit

# 2. Run unit tests
cd tests && npm test

# 3. Build desktop app
cd apps/desktop && npm run build

# 4. Test-specific manual QA (see manualQAChecklist.md)
```

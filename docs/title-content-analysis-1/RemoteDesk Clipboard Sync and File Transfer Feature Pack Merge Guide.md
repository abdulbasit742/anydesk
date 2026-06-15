# RemoteDesk Clipboard Sync and File Transfer Feature Pack Merge Guide

This guide provides instructions for integrating the generated clipboard synchronization and file transfer feature pack into the existing RemoteDesk monorepo.

## Overview of Generated Files

The generated pack includes:

*   **Shared Types and Utilities**: Located in `packages/shared/src/clipboard/` and `packages/shared/src/fileTransfer/`.
    *   `clipboard.types.ts`, `clipboard.constants.ts`, `clipboard.validator.ts`, `clipboard.duplicate-prevention.ts`, `clipboard.debounce.ts`, `clipboard.conflict-resolver.ts`, `clipboard.permission-state.ts`
    *   `fileTransfer.types.ts`, `fileTransfer.constants.ts`, `filenameSanitizer.ts`
    *   `fileTransfer/state/sender.state.ts`, `fileTransfer/state/receiver.state.ts`, `fileTransfer/state/transfer.reducer.ts`, `fileTransfer/state/progress.calculator.ts`, `fileTransfer/state/speed.estimator.ts`, `fileTransfer/state/eta.calculator.ts`
    *   `dataChannel/dataChannel.types.ts`, `dataChannel/dataChannel.sender.ts`, `dataChannel/dataChannel.receiver.ts`
*   **Desktop Client UI Components**: Located in `apps/desktop/src/renderer/src/features/clipboard/` and `apps/desktop/src/renderer/src/features/fileTransfer/`.
    *   `ClipboardSyncToggle.tsx`, `ClipboardStatusBadge.tsx`
    *   `FileTransferPanel.tsx`, `IncomingFileConsentDialog.tsx`, `TransferRow.tsx`, `TransferProgressBar.tsx`, `FileDropZone.tsx`, `FilePickerButton.tsx`, `TransferErrorBanner.tsx`
*   **Electron Main/Preload IPC**: Located in `apps/desktop/src/preload/` and `apps/desktop/src/main/`.
    *   `preload/clipboard/index.ts`, `main/clipboard/index.ts`
    *   `preload/fileTransfer/index.ts`, `main/fileTransfer/index.ts`
*   **Documentation and QA**: Located in `docs/security/` and `docs/qa/desktop/`.
    *   `clipboard-sync-security.md`, `file-transfer-ipc.md`, `threat-model.md`, `abuse-prevention-checklist.md`
    *   `clipboard-qa-checklist.md`, `file-transfer-qa-checklist.md`, `large-file-test-plan.md`, `receiver-consent-test-plan.md`, `permission-denial-test-plan.md`

## Merge Strategy

It is recommended to integrate these files incrementally, focusing on shared components first, then Electron IPC, then UI, and finally integrating with the existing `SessionDataChannel`.

### Step 1: Integrate Shared Packages

1.  **Copy Files**: Copy all files from `packages/shared/src/clipboard/`, `packages/shared/src/fileTransfer/`, and `packages/shared/src/dataChannel/` into their respective directories in your monorepo.
2.  **Install Dependencies**: Ensure `uuid` is installed for file transfer (`npm install uuid` or `yarn add uuid`).
3.  **Review and Adapt**: Review the `clipboard.duplicate-prevention.ts` and `clipboard.conflict-resolver.ts` for their current simplistic implementations. These might need adaptation based on your specific requirements for more robust hashing or conflict resolution logic.

### Step 2: Integrate Electron Main and Preload Processes

1.  **Copy Files**: Copy files from `apps/desktop/src/preload/clipboard/`, `apps/desktop/src/main/clipboard/`, `apps/desktop/src/preload/fileTransfer/`, and `apps/desktop/src/main/fileTransfer/` into their respective directories.
2.  **Update Main Process Entry Point**: In `apps/desktop/src/main/index.ts` (or equivalent), import and call the initialization functions:
    ```typescript
    import { initializeClipboardHandlers, setClipboardSyncEnabled } from './clipboard';
    import { initializeFileTransferHandlers } from './fileTransfer';

    // ... inside your main window creation function ...
    initializeClipboardHandlers(mainWindow);
    initializeFileTransferHandlers(mainWindow);
    // ...
    ```
3.  **Update Preload Entry Point**: In `apps/desktop/src/preload/index.ts` (or equivalent), ensure the new preload scripts are imported. The `contextBridge.exposeInMainWorld` calls are already within the generated preload files, so just importing them should suffice.
    ```typescript
    import './clipboard';
    import './fileTransfer';
    // ...
    ```
4.  **Review IPC Handlers**: Pay close attention to `apps/desktop/src/main/fileTransfer/index.ts` regarding file handle management and error handling. Ensure `closeFileHandle` is called when a transfer completes or is explicitly cancelled by the renderer to prevent resource leaks.

### Step 3: Integrate Desktop Renderer UI Components

1.  **Copy Files**: Copy files from `apps/desktop/src/renderer/src/features/clipboard/` and `apps/desktop/src/renderer/src/features/fileTransfer/` into their respective directories.
2.  **Integrate Components**: Incorporate `ClipboardSyncToggle`, `ClipboardStatusBadge`, `FileTransferPanel`, `IncomingFileConsentDialog`, etc., into your existing React component hierarchy. You will need to manage their state and connect them to the Electron preload APIs.
3.  **State Management**: Decide how to manage the state of clipboard sync and file transfers (e.g., using React Context, Redux, Zustand). The provided components are stateless and expect props for `enabled`, `onToggle`, `transfers`, `onCancelTransfer`, etc.
4.  **WebRTC Data Channel Integration**: This is a critical step. The `packages/shared/src/dataChannel/` files provide the envelope for sending clipboard and file transfer messages over a WebRTC `RTCDataChannel`. You will need to:
    *   Instantiate `RTCDataChannel` in your WebRTC connection logic.
    *   Use `createClipboardMessageEnvelope` and `createFileTransferMessageEnvelope` to wrap your messages.
    *   Implement `sendDataChannelMessage` using your actual `RTCDataChannel` instance.
    *   On the receiving end, use `handleDataChannelMessage` to parse incoming messages and dispatch them to appropriate handlers (e.g., updating UI, triggering main process IPC).

### Step 4: Integrate Documentation and QA

1.  **Copy Files**: Copy all `.md` files from `docs/security/` and `docs/qa/desktop/` into your documentation repository.
2.  **Review and Update**: Review these documents thoroughly. They provide critical insights into the security posture and testing requirements. Adapt them to your specific project context and any existing documentation standards.

## Important Considerations

*   **Error Handling**: The generated code includes basic error logging. Enhance this with your application's specific error reporting and user notification mechanisms.
*   **User Experience**: Ensure that all user interactions (consent dialogs, progress indicators, error messages) are intuitive and provide clear feedback.
*   **Testing**: Thoroughly test all aspects of the clipboard sync and file transfer features, especially focusing on security, edge cases, and performance, using the provided QA checklists and test plans.
*   **TypeScript Strictness**: The generated code aims for TypeScript strict-compatibility. Ensure your project's `tsconfig.json` is configured appropriately.
*   **TailwindCSS**: The UI components use TailwindCSS. Ensure your project has TailwindCSS configured and running.

## Review Required Files

The following files are marked as `REVIEW_REQUIRED` in the manifest. These files contain critical security or architectural information that must be thoroughly reviewed and potentially adapted to your specific security policies and application architecture:

*   `docs/security/clipboard-sync-security.md`
*   `docs/architecture/file-transfer-ipc.md`
*   `docs/security/threat-model.md`
*   `docs/security/abuse-prevention-checklist.md`
*   `docs/qa/desktop/clipboard-qa-checklist.md`
*   `docs/qa/desktop/file-transfer-qa-checklist.md`
*   `docs/qa/desktop/large-file-test-plan.md`
*   `docs/qa/desktop/receiver-consent-test-plan.md`
*   `docs/qa/desktop/permission-denial-test-plan.md`

By following this guide, you should be able to successfully integrate the new features into your RemoteDesk application.

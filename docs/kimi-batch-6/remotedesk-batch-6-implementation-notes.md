# RemoteDesk Batch 6 Implementation Notes

This document provides key implementation details, decisions, and considerations for the features developed in Batch 6 of the RemoteDesk project, covering Data Channel Multiplexing, File Transfer, Clipboard Sync, and In-Session Chat.

## 1. General Implementation Principles

- **TypeScript First:** All new code is written in TypeScript to leverage static typing for improved code quality, maintainability, and developer experience.
- **Modularity:** Features are designed with modularity in mind, separating concerns into distinct files and classes (e.g., `MessageRouter`, `FileTransferSender`, `ChatManager`). This promotes reusability and easier testing.
- **Zod for Validation:** Zod is used extensively for runtime validation of all incoming and outgoing data channel messages. This ensures data integrity and provides clear error messages for malformed payloads.
- **UUID for Identifiers:** `uuidv4` is used to generate unique identifiers for messages, transfers, and other entities, ensuring global uniqueness.

## 2. Data Channel Multiplexing

- **`DataChannelEnvelope`:** A universal envelope (`packages/shared/src/types/dataChannel.ts`) wraps all messages sent over WebRTC data channels. This allows for a single data channel to carry various types of application-specific messages.
- **`MessageRouter`:** The `MessageRouter` (`packages/shared/src/dataChannel/MessageRouter.ts`) subscribes to specific `DataChannelMessageType`s and dispatches them to registered handlers. This decouples message processing logic from the underlying data channel transport.
- **`BackpressureHandler`:** The `BackpressureHandler` (`packages/shared/src/dataChannel/BackpressureHandler.ts`) monitors `RTCDataChannel.bufferedAmount` and pauses message sending when the buffer exceeds a threshold (16MB). This prevents network congestion and ensures reliable delivery, especially for large file transfers.
- **`HeartbeatManager`:** A simple heartbeat mechanism (`packages/shared/src/dataChannel/HeartbeatManager.ts`) sends periodic messages to measure latency and confirm channel liveness. This can be extended for more sophisticated connection monitoring.

## 3. File Transfer Protocol

- **Chunking Strategy:** Files are split into 16KB chunks (`FILE_TRANSFER_CHUNK_SIZE` in `packages/shared/src/fileTransfer/constants.ts`). This size is chosen to balance overhead and WebRTC data channel stability. Each chunk is Base64 encoded for JSON transport.
- **`FileTransferSender`:** Manages the sending process, including initiating transfers, chunking files, and handling pause/resume logic. It currently uses a basic approach for sending chunks and marks them as sent. Full ACK/NACK and retry logic are planned for future iterations.
- **`FileTransferReceiver`:** Handles the receiving process, reassembling chunks into the complete file. It stores chunks in a Map and reconstructs the file once all chunks are received.
- **Checksums:** Placeholder checksums are currently used for chunks. A robust SHA256 implementation for both file and chunk integrity is a high priority for the next batch.
- **File System Interaction (Electron Main Process):** File operations (picking, saving, reading/writing chunks) are handled via Electron's IPC in `apps/desktop/src/main/fileBridge/FileSystemBridge.ts`. This ensures secure access to the local file system and prevents renderer process sandboxing issues.
- **`FilenameSanitizer`:** `apps/desktop/src/main/fileBridge/FilenameSanitizer.ts` is used to clean filenames, removing illegal characters and handling reserved names to prevent security vulnerabilities like path traversal.

## 4. Clipboard Synchronization

- **`ClipboardSyncManager`:** This class (`packages/shared/src/clipboard/ClipboardSyncManager.ts`) is responsible for detecting local clipboard changes, sending them over the data channel, and updating the local clipboard with remote content. It includes a basic mechanism to prevent syncing the same content repeatedly.
- **Opt-in Mechanism:** Clipboard sync is designed as an explicit opt-in feature, controlled by the `isSyncEnabled` flag in `ClipboardSyncManager` and a UI toggle in `ClipboardPanel.tsx`.
- **Content Type:** Currently, only text clipboard content is supported. Future work may extend this to images or other formats.
- **Conflict Prevention:** The current implementation assumes a 
last-write-wins strategy, where the most recent clipboard update takes precedence. More sophisticated conflict resolution could be implemented if needed.

## 5. In-Session Chat

- **`ChatManager`:** The `ChatManager` (`packages/shared/src/chat/ChatManager.ts`) handles the sending and receiving of chat messages. It maintains an in-memory array of messages and notifies UI components of new messages.
- **Message Structure:** Chat messages (`ChatMessage` in `packages/shared/src/types/chat.ts`) include `senderId`, `sessionId`, `timestamp`, `type` (TEXT or SYSTEM), and `content`.
- **UI Integration:** The `ChatPanel.tsx` component provides a basic chat interface with message display and input functionality. Auto-scrolling to the latest message is implemented.

## 6. Backend Support

- **`AuditService`:** The `AuditService` (`apps/api/src/services/AuditService.ts`) provides a centralized mechanism for logging significant events, such as file transfer start/end and clipboard sync status changes. This is crucial for security, compliance, and operational monitoring.
- **`FeatureFlagService`:** The `FeatureFlagService` (`apps/api/src/services/FeatureFlagService.ts`) allows for dynamic control over feature availability. This enables A/B testing, phased rollouts, and quick disabling of features if issues arise.

## 7. Testing

- **Unit Tests:** Initial unit tests have been created for core utilities like `FilenameSanitizer` and `MessageRouter` using `jest`. Further test coverage is required for all new modules, especially for complex logic like file chunking, ACK/NACK handling, and permission gates.

## 8. Dependencies Added

- `uuid`: Used for generating unique identifiers.
- `zod`: Used for schema-based data validation.

## 9. How to Run/Typecheck/Test

- **Setup:** Navigate to `remotedesk/packages/shared` and run `npm install` to install dependencies.
- **Typecheck:** Run `tsc` in `remotedesk/packages/shared` to typecheck the shared package.
- **Test:** Run `jest` in `remotedesk/packages/shared` to execute unit tests.
- **Desktop App:** The desktop application (`apps/desktop`) would typically be run using `electron .` after building the renderer and main processes. (Further setup details for `apps/desktop` are outside the scope of this batch).

## 10. Known Risks

Refer to `generated-batch-6-risk-register.md` for a detailed list of identified risks and their mitigation strategies.

## 11. What the Next 200-File Batch Should Focus On

The next batch should prioritize:
- **Robust File Transfer:** Fully implementing ACK/NACK, retry mechanisms, progress/speed estimators, and robust checksum validation.
- **Comprehensive Permission Gates:** Implementing explicit permission checks for all sensitive operations (file transfer, clipboard sync) at both the protocol and UI levels.
- **Enhanced UI/UX:** Completing the UI for file transfer and clipboard sync, including detailed transfer lists, status indicators, and user settings.
- **Reconnect Handling:** Implementing logic for data channel reconnection and state synchronization after network interruptions.
- **Full Test Coverage:** Expanding unit and integration tests for all new modules.
- **Backend Integration:** Completing audit logging for clipboard sync and chat, and implementing plan limit checks.

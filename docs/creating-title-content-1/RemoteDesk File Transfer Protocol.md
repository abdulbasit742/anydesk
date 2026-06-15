# RemoteDesk File Transfer Protocol

## 1. Overview

The RemoteDesk File Transfer Protocol facilitates secure and efficient transfer of files between the host and viewer clients over WebRTC data channels. It is designed to handle large files by chunking them and includes mechanisms for reliability, pause/resume functionality, and explicit user consent.

## 2. Core Concepts

### 2.1 Data Channel Multiplexing
File transfer messages are sent over a multiplexed WebRTC data channel, ensuring they coexist with other communication types (e.g., chat, clipboard sync) without interference. Each file transfer operation is encapsulated within a `DataChannelEnvelope` with a specific `FILE_TRANSFER` message type.

### 2.2 File Chunking
Large files are split into smaller, fixed-size chunks (e.g., 16KB) to optimize transmission over WebRTC and improve resilience against network interruptions. Each chunk is sent independently and reassembled at the receiver.

### 2.3 Reliability and Flow Control
- **ACK/NACK:** Acknowledgment (ACK) and Negative Acknowledgment (NACK) messages are used to confirm successful chunk reception and request retransmission of lost or corrupted chunks.
- **Backpressure Handling:** The protocol incorporates backpressure mechanisms to prevent overwhelming the data channel or the receiving client, ensuring smooth data flow even under varying network conditions.

### 2.4 Security and Permissions
- **Explicit Opt-in:** File transfer functionality must be explicitly enabled by both the sender and receiver.
- **Incoming File Consent:** For incoming files, the receiving user is prompted with a consent dialog to accept or reject the transfer, preventing unsolicited file reception.
- **Filename Sanitization:** All incoming filenames are sanitized to prevent directory traversal attacks and ensure compatibility across different operating systems.
- **File Size Limits:** A maximum file size limit (e.g., 2GB) is enforced to prevent resource exhaustion.

## 3. Message Flow

### 3.1 Initiating a Transfer
1. **Sender:** Selects files for transfer.
2. **Sender:** Generates unique `transferId` and calculates file metadata (name, size, type, checksum, total chunks).
3. **Sender:** Sends a `FileTransferMessageType.METADATA` message via the data channel, including file metadata and sender/recipient IDs.
4. **Receiver:** Receives the metadata message and, if enabled, displays an `IncomingFileConsent` dialog to the user.
5. **Receiver:** Upon user acceptance, sends an ACK for the metadata, indicating readiness to receive chunks.

### 3.2 Chunk Transmission
1. **Sender:** Begins sending `FileTransferMessageType.CHUNK` messages, each containing a base64-encoded chunk of the file data, its index, and a chunk-specific checksum.
2. **Receiver:** Stores received chunks and sends `FileTransferMessageType.ACK` for successfully received chunks.
3. **Receiver:** If a chunk is missing or corrupted, sends `FileTransferMessageType.NACK` or `FileTransferMessageType.REQUEST_RESEND` for specific chunk indices.
4. **Sender:** Retransmits NACKed or requested chunks.

### 3.3 Transfer Completion
1. **Receiver:** Once all chunks are received and validated, reassembles the file.
2. **Receiver:** Sends a final ACK for the completed transfer.
3. **Sender:** Marks the transfer as complete.

## 4. Pause, Resume, and Cancel

- **Pause:** Either party can send a `FileTransferMessageType.PAUSE` message to temporarily halt chunk transmission.
- **Resume:** A `FileTransferMessageType.RESUME` message restarts transmission from the last acknowledged chunk.
- **Cancel:** A `FileTransferMessageType.CANCEL` message terminates the transfer for both parties.

## 5. Error Handling

Errors such as network interruptions, invalid chunks, or permission denials are handled by specific error messages and state transitions, ensuring robust transfer operations.

## 6. Audit Logging

Key events (transfer start, completion, failure) are logged via the `AuditService` on the backend for security and monitoring purposes.

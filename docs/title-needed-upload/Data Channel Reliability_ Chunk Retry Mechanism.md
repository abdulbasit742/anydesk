# Data Channel Reliability: Chunk Retry Mechanism

This document describes the chunk retry mechanism implemented for reliable data transfer over WebRTC Data Channels in RemoteDesk, particularly for features like file transfer. This mechanism ensures that even if individual data chunks are lost during transmission, they are re-requested and re-sent, guaranteeing the integrity of the overall data.

## 1. Context: Reliable Data Channels

WebRTC Data Channels, when configured as `ordered: true` and `maxRetransmits: undefined` (or a high number), provide a reliable transport layer. However, for large data transfers like files, it's beneficial to have an application-level retry mechanism for individual chunks to handle potential issues more gracefully and provide better progress feedback.

## 2. Chunking Strategy

Large files are divided into smaller, fixed-size chunks before transmission. Each chunk is assigned a unique identifier and a sequence number.

```typescript
// packages/shared/utils/fileChunker.ts (Conceptual)

interface FileChunk {
  fileId: string;       // Unique ID for the entire file transfer
  chunkId: number;      // Unique ID for this chunk within the file
  totalChunks: number;  // Total number of chunks for the file
  data: ArrayBuffer;    // The actual binary data of the chunk
  checksum?: string;    // Optional: CRC32 or SHA256 checksum for integrity verification
}

const CHUNK_SIZE = 16 * 1024; // 16 KB per chunk

function* chunkFile(file: File): Generator<FileChunk> {
  const fileId = generateUniqueId(); // Function to generate a unique ID
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const slice = file.slice(start, end);

    yield {
      fileId,
      chunkId: i,
      totalChunks,
      data: await slice.arrayBuffer(),
      // checksum: calculateChecksum(slice) // Optional
    };
  }
}
```

## 3. Chunk Retry Mechanism

### 3.1. Sender Side

1.  **Send Chunks:** The sender transmits file chunks sequentially over the data channel.
2.  **Maintain Sent Chunks:** The sender keeps a record of all sent chunks and their `chunkId`s.
3.  **Timeout for Acknowledgments:** For each sent chunk, a timer is started. If an acknowledgment (ACK) for that `chunkId` is not received within a specified timeout, the chunk is marked for retransmission.
4.  **Retransmission Queue:** Lost chunks are added to a retransmission queue and resent. A maximum number of retries per chunk is defined to prevent infinite loops in case of persistent network issues.

### 3.2. Receiver Side

1.  **Receive Chunks:** The receiver collects incoming chunks.
2.  **Track Missing Chunks:** The receiver maintains a bitmap or list of expected `chunkId`s and identifies any missing ones.
3.  **Send NACKs (Negative Acknowledgments):** If a chunk is missing after a certain period (e.g., a gap is detected in sequence numbers, or a global timeout for the file transfer is approaching), the receiver sends a NACK message back to the sender, requesting specific `chunkId`s.
4.  **Reassemble File:** Once all chunks for a `fileId` are received (and optionally verified with a checksum), they are reassembled into the original file.

### 3.3. Protocol Messages (Conceptual)

```typescript
// packages/shared/protocols/fileTransferProtocol.ts (Conceptual)

interface FileTransferStartMessage {
  type: 'FILE_START';
  fileId: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
}

interface FileTransferChunkMessage {
  type: 'FILE_CHUNK';
  fileId: string;
  chunkId: number;
  data: ArrayBuffer;
}

interface FileTransferAckMessage {
  type: 'FILE_ACK';
  fileId: string;
  chunkId: number;
}

interface FileTransferNackMessage {
  type: 'FILE_NACK';
  fileId: string;
  missingChunkIds: number[]; // List of chunk IDs that are missing
}

interface FileTransferCompleteMessage {
  type: 'FILE_COMPLETE';
  fileId: string;
  checksum?: string; // Optional: for final integrity check
}
```

## 4. Error Handling and Edge Cases

*   **Max Retries Exceeded:** If a chunk fails to transfer after a maximum number of retries, the entire file transfer is aborted, and an error is reported to the user.
*   **Connection Loss During Transfer:** If the WebRTC connection drops, the file transfer is paused or aborted. Upon reconnection, the transfer can potentially be resumed from the last successfully acknowledged chunk.
*   **Checksum Mismatch:** If an optional checksum is used and it doesn't match upon reassembly, the file is considered corrupted, and the transfer fails.

## 5. Testing Chunk Retry

*   **Unit Tests:** Test the chunking logic, ACK/NACK processing, and retransmission queue management.
*   **Integration Tests:** Simulate file transfers under controlled conditions, introducing artificial packet loss to verify the retry mechanism correctly recovers and completes the transfer.
*   **Performance Tests:** Evaluate the overhead of the retry mechanism on CPU and network usage, especially for large files.

## 6. Diagnostic Information

If file transfer issues related to chunk retries are suspected, gather the following:

1.  **Application Logs:** Detailed logs from both sender and receiver, showing chunk send/receive events, ACKs, NACKs, and retransmissions.
2.  **Network Conditions:** Description of network environment (packet loss, latency).
3.  **File Details:** Size and type of the file being transferred.

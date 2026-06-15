# File Transfer Protocol

## Overview

File transfer uses the `rd-files` data channel with chunked transmission, ACK/NACK, and retry logic.

## Flow

1. Sender offers file (metadata + transfer ID)
2. Receiver accepts or rejects
3. Sender transmits chunks
4. Receiver ACKs each chunk
5. Missing chunks are retransmitted
6. Transfer completes or is cancelled

## Chunk Format

```json
{
  "transferId": "ft_1234567890_abc123",
  "chunkIndex": 0,
  "totalChunks": 100,
  "data": "base64encoded...",
  "checksum": "sha256"
}
```

## Configuration

- Default chunk size: 16KB
- Window size: 32 chunks
- Max retries per chunk: 5
- Chunk timeout: 10s
- Transfer timeout: 5min
- Max file size: 2GB

## Implementation

- Contracts: `packages/shared/src/file-transfer/`
- Desktop UI: `apps/desktop/src/renderer/src/features/file-transfer/FileTransferPanel.tsx`

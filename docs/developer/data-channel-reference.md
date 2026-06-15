# Data Channel Reference

## Data Channels (WebRTC)
Used for P2P communication during active sessions.

### Labels
| Label | Purpose | Priority |
|-------|---------|----------|
| `chat` | Text messages | Low |
| `clipboard` | Clipboard sync | Medium |
| `file-transfer` | File chunks | Low |
| `input` | Mouse/keyboard | High |
| `metrics` | Quality metrics | Low |

## Message Format
```typescript
interface ChannelMessage {
  type: string;
  payload: unknown;
  timestamp: number;
  seq: number;  // Sequence number for ordering
}
```

## Chat Protocol
```typescript
// Send
{ type: "chat", payload: { text: "Hello" }, timestamp: 1234567890, seq: 1 }

// Receive
{ type: "chat", payload: { text: "Hello", senderId: "usr_001" }, timestamp: 1234567891, seq: 2 }
```

## File Transfer Protocol
```typescript
// 1. Start
{ type: "file-start", payload: { fileId, name, size, mimeType } }

// 2. Chunks (repeated)
{ type: "file-chunk", payload: { fileId, chunk, totalChunks, data: base64 } }

// 3. End
{ type: "file-end", payload: { fileId } }

// 4. Ack
{ type: "file-ack", payload: { fileId, success } }
```

## Input Protocol
```typescript
// Mouse move
{ type: "input", payload: { type: "mousemove", x: 100, y: 200 } }

// Click
{ type: "input", payload: { type: "click", x: 100, y: 200, button: 0 } }

// Key
{ type: "input", payload: { type: "keydown", key: "Enter", modifiers: { ctrl: true } } }
```

## Flow Control
- Input channel: Reliable, ordered
- File transfer: Reliable, chunked, with acknowledgments
- Chat: Reliable, ordered
- Metrics: Unordered, loss acceptable

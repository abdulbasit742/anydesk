# Socket Event Reference

## Device Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `device:register` | C->S | `{ remoteDeskId, name }` | Register device |
| `device:online` | S->C | `{ remoteDeskId }` | Device came online |
| `device:offline` | S->C | `{ remoteDeskId }` | Device went offline |

## Session Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `session:request` | C->S | `{ to, from }` | Request session |
| `session:accept` | C->S | `{ to }` | Accept request |
| `session:reject` | C->S | `{ to, reason? }` | Reject request |
| `session:accepted` | S->C | `{ to }` | Request accepted |
| `session:rejected` | S->C | `{ reason? }` | Request rejected |
| `session:end` | C->S | `{ to }` | End session |
| `session:ended` | S->C | `{}` | Session ended |

## WebRTC Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `webrtc:offer` | C->S | `{ to, from, signal }` | SDP offer |
| `webrtc:answer` | C->S | `{ to, from, signal }` | SDP answer |
| `webrtc:ice-candidate` | C->S | `{ to, from, signal }` | ICE candidate |

## Channel Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `channel:message` | C->S | `{ to, message, from }` | Chat message |
| `channel:clipboard` | C->S | `{ to, text, from }` | Clipboard sync |
| `channel:file-start` | C->S | `{ to, fileId, name, size, from }` | File transfer start |
| `channel:file-chunk` | C->S | `{ to, fileId, chunk, data, from }` | File chunk |
| `channel:file-end` | C->S | `{ to, fileId, from }` | File transfer end |
| `channel:input` | C->S | `{ to, input, from }` | Remote input |

## Authentication
All events require authentication via socket handshake:
```javascript
const socket = io(url, { auth: { token: jwtToken } });
```

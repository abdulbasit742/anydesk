# WebSocket Development Guide

## Socket Events

### Server -> Client
| Event | Payload | Description |
|-------|---------|-------------|
| `connection:request` | ConnectionRequest | Incoming connection |
| `connection:accepted` | ConnectionResponse | Request accepted |
| `connection:rejected` | { reason } | Request rejected |
| `signal:offer` | SignalOffer | WebRTC offer |
| `signal:answer` | SignalAnswer | WebRTC answer |
| `signal:ice` | IceCandidate | ICE candidate |
| `session:ended` | { reason } | Session ended |

### Client -> Server
| Event | Payload | Description |
|-------|---------|-------------|
| `connection:request` | ConnectionRequest | Request connection |
| `connection:response` | ConnectionResponse | Accept/reject |
| `signal:offer` | SignalOffer | Send offer |
| `signal:answer` | SignalAnswer | Send answer |
| `signal:ice` | IceCandidate | Send candidate |
| `session:disconnect` | { sessionId } | End session |

## Adding a New Event

### Server Side
```typescript
io.on('connection', (socket) => {
  socket.on('my:event', (payload) => {
    // Validate payload
    // Process
    // Emit response
    socket.emit('my:response', { success: true });
  });
});
```

### Client Side
```typescript
socket.emit('my:event', payload);
socket.on('my:response', (response) => {
  console.log(response);
});
```

## Testing WebSockets
```typescript
describe('WebSocket', () => {
  it('should handle connection request', (done) => {
    const client = io('http://localhost:3000');
    client.emit('connection:request', {
      targetDeviceId: '123456789',
    });
    client.on('connection:accepted', () => {
      done();
    });
  });
});
```

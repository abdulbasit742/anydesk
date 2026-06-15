# System Architecture

## High-Level Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │     │   Desktop   │     │   Mobile    │
│  (Next.js)  │     │  (Electron) │     │  (Future)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │ HTTPS/WSS
                    ┌──────┴──────┐
                    │    Nginx    │
                    │   (Proxy)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌────┴────┐
        │    API    │ │  Web   │ │ Coturn  │
        │ (Express) │ │ (SSR)  │ │ (TURN)  │
        └─────┬─────┘ └────────┘ └─────────┘
              │
        ┌─────┴──────┐
        │            │
   ┌────┴────┐  ┌───┴────┐
   │PostgreSQL│  │ Redis  │
   └─────────┘  └────────┘
```

## Components

### API Server (Node.js/Express)
- REST API endpoints
- Socket.IO signaling server
- WebRTC coordination
- Authentication and authorization
- Billing webhook handling

### Web App (Next.js)
- React-based dashboard
- Server-side rendering
- Real-time updates via Socket.IO
- Responsive design

### Desktop App (Electron)
- Native screen capture
- WebRTC peer connections
- System tray integration
- Auto-updater support

### Infrastructure
- PostgreSQL: Primary data store
- Redis: Sessions, caching, rate limiting
- Coturn: TURN/STUN for NAT traversal
- Nginx: Reverse proxy, SSL termination

## Data Flow

### Session Establishment
1. Host registers device → gets RemoteDesk ID
2. Client enters ID → session request created
3. Host accepts → WebRTC signaling begins
4. ICE exchange → peer connection established
5. Media flow begins

### Signaling Protocol
```
Client                    Server                    Host
  │    session:request     │                         │
  ├───────────────────────>│                         │
  │                        │    session:incoming     │
  │                        ├────────────────────────>│
  │                        │    session:accept       │
  │                        │<────────────────────────┤
  │    session:started     │                         │
  │<───────────────────────┤                         │
  │    webrtc:offer        │                         │
  ├───────────────────────>│    webrtc:offer         │
  │                        ├────────────────────────>│
  │                        │    webrtc:answer        │
  │    webrtc:answer       │<────────────────────────┤
  │<───────────────────────┤                         │
  │    webrtc:ice-candidate│    webrtc:ice-candidate │
  ├───────────────────────>│<───────────────────────>│
```

## Scaling Considerations
- API servers: Horizontal scaling behind load balancer
- Database: Read replicas for queries
- Redis: Cluster mode for sessions
- Socket.IO: Redis adapter for multi-server
- Coturn: Multiple TURN servers with DNS load balancing

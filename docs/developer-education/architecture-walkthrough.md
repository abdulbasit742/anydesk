# RemoteDesk Architecture Walkthrough

## System Overview
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Desktop   │     │    Web      │     │   Mobile    │
│    App      │     │    App      │     │  (future)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │ HTTPS / WSS
                           ▼
                  ┌─────────────────┐
                  │   API Server    │
                  │   (Express)     │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │PostgreSQL│  │  Redis  │  │  S3/FS  │
        └─────────┘  └─────────┘  └─────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Socket.IO      │
                  │  Signaling      │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │   TURN  │  │   STUN  │  │  WebRTC  │
        │ Server  │  │ Server  │  │  Peers   │
        └─────────┘  └─────────┘  └─────────┘
```

## Data Flow: Session Establishment
```
1. Host logs in -> API returns desk ID + JWT
2. Host opens desktop app -> Socket.IO connection
3. Host joins signaling room (desk ID)
4. Viewer enters host desk ID
5. Socket.IO: session_request event
6. Host accepts -> WebRTC offer/answer exchange
7. ICE candidate exchange
8. DTLS handshake -> SRTP media flow
9. Session established!
```

## Key Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React, Electron | UI |
| Backend | Node.js, Express | API |
| Real-time | Socket.IO | Signaling |
| Media | WebRTC | P2P streaming |
| Database | PostgreSQL | Persistence |
| Cache | Redis | Sessions, rate limits |
| Storage | S3/Filesystem | Files, recordings |
| TURN | Coturn | NAT traversal |

## Monorepo Structure
```
remotedesk/
├── apps/
│   ├── api/          # Backend server
│   ├── web/          # Next.js web app
│   └── desktop/      # Electron desktop app
├── packages/
│   └── shared/       # Shared types, constants
├── docs/             # Documentation
└── scripts/          # Automation scripts
```

# RemoteDesk Attack Surface Map

## External Surfaces
```
Internet
  |-- HTTPS :443 --> Web App / API Gateway
  |-- WSS :443 --> Socket.IO Signaling
  |-- TURN :3478 --> Coturn Server
  |-- STUN :3478 --> Coturn Server
```

## Internal Surfaces
```
API Server
  |-- :5432 --> PostgreSQL
  |-- :6379 --> Redis
  |-- :1025 --> SMTP (email)
  |-- Internal --> Audit Log Store

Web App
  |-- Internal --> API Server
  |-- CDN --> Static Assets

Desktop App
  |-- :443 --> API Server
  |-- :3478 --> TURN Server
  |-- Localhost --> OS APIs
```

## Surface Inventory
| Surface | Protocol | Auth | Encryption | Monitoring |
|---------|----------|------|------------|------------|
| Web API | HTTPS | JWT | TLS 1.3 | Yes |
| Signaling | WSS | JWT | TLS 1.3 | Yes |
| WebRTC | UDP/TCP | DTLS | SRTP | Yes |
| TURN | UDP/TCP | Shared secret | TLS (optional) | Yes |
| Database | TCP | Password | TLS | Yes |
| Redis | TCP | Password | TLS | Yes |

## Minimization
- No SSH exposed
- No management ports public
- Database only accessible from app subnet
- Redis only accessible from app subnet

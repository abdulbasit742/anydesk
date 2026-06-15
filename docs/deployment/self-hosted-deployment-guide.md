# RemoteDesk Self-Hosted Deployment Guide

## Requirements
- Docker 24+ and Docker Compose
- Public IP or reverse proxy
- 4 vCPU, 8GB RAM minimum

## Docker Compose
```yaml
version: "3.8"
services:
  api:
    image: remotedesk/api:latest
    ports: ["4000:4000"]
    env_file: .env
    depends_on: [db, redis]
  web:
    image: remotedesk/web:latest
    ports: ["3000:3000"]
  db:
    image: postgres:15
    volumes: ["pgdata:/var/lib/postgresql/data"]
  redis:
    image: redis:7-alpine
  coturn:
    image: coturn/coturn
    ports: ["3478:3478/tcp", "3478:3478/udp", "49152-65535:49152-65535/udp"]
```

## Environment Variables
```
DATABASE_URL=postgresql://user:pass@db:5432/remotedesk
REDIS_URL=redis://redis:6379
JWT_SECRET=<random-256-bit-key>
TURN_SERVER_URL=turn:your-domain.com:3478
TURN_SECRET=<coturn-secret>
```

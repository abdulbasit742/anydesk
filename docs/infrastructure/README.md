# Infrastructure

## Docker Compose
Production-ready multi-service setup:
- API server (Node.js)
- Web app (Next.js)
- PostgreSQL 16
- Redis 7
- Coturn TURN server
- Nginx reverse proxy

## Nginx Configuration
- SSL termination with HTTP/2
- WebSocket proxying for Socket.IO
- Rate limiting per endpoint
- API and web routing

## Coturn TURN Server
- UDP port range: 49152-65535
- Authentication via shared secret
- TLS support (configure certs)

## Backup Strategy
- Daily automated database dumps
- Redis RDB snapshots
- 30-day retention
- Simple restore script

## Monitoring (Skeleton)
- Prometheus configuration
- Alert rules for critical conditions
- Grafana dashboards (future)

## Deployment
1. Copy `infra/.env.template` to `.env` and fill values
2. Run `docker compose -f infra/docker/docker-compose.prod.yml up -d`
3. Run migrations: `npx prisma migrate deploy`
4. Verify health endpoints

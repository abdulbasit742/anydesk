# DevOps Documentation

## Docker
- Dockerfile with multi-stage build
- docker-compose.yml with app, db, redis, turn
- Health checks on all services

## Scripts
- `backup.sh` - Database and recordings backup
- `restore.sh` - Restore from backup
- `health-check.sh` - Service health check
- `setup-environment.sh` - Initial setup
- `deploy.sh` - Deployment automation

## Nginx
- SSL/TLS termination
- WebSocket proxying
- Rate limiting
- Static file serving

## TURN Server
- coturn configuration
- STUN/TURN/relay support
- Port range: 10000-20000 UDP

## Monitoring
- Health endpoint: `/api/health`
- Metrics endpoint: `/api/metrics`
- Log rotation configured
- Sentry integration ready

## Backups
- Daily automated backups
- 30-day retention
- MySQL + recordings

## Environment Variables
See `.env.production.example` for full list.

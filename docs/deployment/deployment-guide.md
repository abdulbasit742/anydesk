# Deployment Guide

## Prerequisites
- Docker 24+
- Docker Compose 2+
- 4GB RAM minimum (8GB recommended)
- SSL certificates

## Environments
### Development
```bash
docker-compose -f config/docker-compose.dev.yml up -d
```

### Production
```bash
export VERSION=v1.0.0
docker-compose -f config/docker-compose.prod.yml up -d
```

## SSL Setup
Place certificates in `config/nginx/ssl/`:
- `cert.pem` - Full certificate chain
- `key.pem` - Private key

## First Deploy
1. Copy `.env.example` to `.env` and fill values
2. Run migrations: `./scripts/migrate.sh`
3. Start services: `docker-compose -f config/docker-compose.prod.yml up -d`
4. Verify: `curl https://api.remotedesk.io/health`

## Updates
```bash
# Pull new images
docker-compose -f config/docker-compose.prod.yml pull
# Run migrations
./scripts/migrate.sh
# Rolling restart
docker-compose -f config/docker-compose.prod.yml up -d
```

## Backup
```bash
# Automated (cron daily 2AM)
0 2 * * * /opt/remotedesk/scripts/backup.sh

# Manual
./scripts/backup.sh
```

## Troubleshooting
- Check logs: `docker-compose logs -f api`
- Health check: `curl /health`
- DB connection: `docker-compose exec postgres psql -U postgres`

# Deployment Guide

## Prerequisites
- Docker Engine 24+
- Docker Compose v2+
- 4GB RAM minimum
- SSL certificates

## First Deployment
1. Clone repository
2. Run setup: `bash infra/scripts/setup.sh`
3. Configure Stripe keys in `.env`
4. Start services: `docker compose -f infra/docker/docker-compose.prod.yml up -d`
5. Run migrations: `docker exec remotedesk-api-1 npx prisma migrate deploy`
6. Verify: `curl https://api.remotedesk.io/health`

## Updates
1. Pull latest code
2. Rebuild: `docker compose build`
3. Restart: `docker compose up -d`
4. Migrate: `docker exec remotedesk-api-1 npx prisma migrate deploy`

## Rollback
1. `docker compose down`
2. Restore database: `bash infra/scripts/restore.sh <timestamp>`
3. `docker compose up -d`

## SSL Certificates
For production, replace self-signed certs:
```bash
cp /path/to/cert.pem infra/nginx/ssl/cert.pem
cp /path/to/key.pem infra/nginx/ssl/key.pem
docker compose restart nginx
```

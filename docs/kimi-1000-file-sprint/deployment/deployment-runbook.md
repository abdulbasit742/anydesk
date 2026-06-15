# RemoteDesk Deployment Runbook

## Prerequisites

- Docker 24+
- Docker Compose 2+
- Kubernetes 1.28+ (optional)
- PostgreSQL 16
- Redis 7
- Coturn (TURN/STUN server)
- Domain with SSL certificate

## Quick Start (Docker Compose)

```bash
# 1. Clone repository
git clone https://github.com/remotedesk/remotedesk.git
cd remotedesk

# 2. Copy environment
cp apps/api/.env.example .env
# Edit .env with your values

# 3. Start services
docker-compose -f infra/docker/docker-compose.yml up -d

# 4. Run migrations
docker-compose exec api npx prisma migrate deploy

# 5. Verify
curl http://localhost:4000/api/v1/health
```

## Kubernetes Deployment

```bash
# 1. Apply manifests
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/configmap.yaml
kubectl apply -f infra/k8s/api-deployment.yaml
kubectl apply -f infra/k8s/api-service.yaml
kubectl apply -f infra/k8s/web-deployment.yaml
kubectl apply -f infra/k8s/web-service.yaml
kubectl apply -f infra/k8s/ingress.yaml

# 2. Verify
kubectl get pods -n remotedesk
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection |
| JWT_SECRET | Yes | JWT signing key |
| STRIPE_SECRET_KEY | No | Stripe payments |
| TURN_SERVER_URL | No | TURN relay server |
| REDIS_URL | No | Session caching |

## Health Checks

- API: `GET /api/v1/health`
- DB: `pg_isready -U postgres`
- Redis: `redis-cli ping`

## Backup

```bash
./scripts/backup-db.sh
```

## Restore

```bash
./scripts/restore-db.sh backups/remotedesk_YYYYMMDD_HHMMSS.sql
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WebRTC fails | Check STUN/TURN servers |
| High latency | Enable TURN relay |
| DB connection fail | Verify DATABASE_URL |
| CORS errors | Check CORS_ORIGIN |

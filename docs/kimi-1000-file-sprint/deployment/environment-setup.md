# Environment Setup

## Required Variables

### API Server

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=random-secret-key
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=another-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TURN_SERVER_URL=turn:turn.example.com:3478
TURN_SECRET=turn-secret
REDIS_URL=redis://redis:6379
CORS_ORIGIN=https://app.example.com
```

### Web App

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
```

### Desktop App

```env
API_URL=https://api.example.com
WS_URL=wss://api.example.com
```

## SSL Certificates

Production requires valid SSL certificates:

```bash
# Let's Encrypt
certbot certonly --standalone -d api.example.com -d app.example.com
```

## Database Setup

```bash
# Create database
createdb remotedesk

# Run migrations
cd apps/api && npx prisma migrate deploy

# Optional: Seed data
npx prisma db seed
```

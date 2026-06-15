# RemoteDesk Small Business Deployment Guide

## Overview
Deploy RemoteDesk for teams of 5-50 users.

## Requirements
- 1x Server: 2 vCPU, 4GB RAM, 20GB SSD
- PostgreSQL 15+
- Node.js 20+
- Domain with SSL certificate

## Quick Start
```bash
# 1. Clone
git clone https://github.com/remotedesk/remotedesk.git
cd remotedesk

# 2. Configure
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, TURN_SERVER config

# 3. Deploy
docker-compose up -d
```

## Architecture
```
[User] -> [Nginx] -> [Next.js App] -> [API Server] -> [PostgreSQL]
                          |
                    [Socket.IO] -> [Redis (optional)]
```

## SSL (Let's Encrypt)
```bash
certbot --nginx -d your-domain.com
```

## Estimated Time: 30 minutes

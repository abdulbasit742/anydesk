# RemoteDesk Development Environment Setup

## Prerequisites
- Node.js 20+
- Docker and Docker Compose
- Git
- PostgreSQL 15+
- Redis 7+

## Quick Start
```bash
# Clone
git clone https://github.com/remotedesk/remotedesk.git
cd remotedesk

# Install
npm install

# Start infrastructure
docker-compose up -d db redis

# Run migrations
npx prisma migrate dev

# Start
npm run dev
```

## Services
| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Next.js frontend |
| API | http://localhost:4000 | Express backend |
| Socket.IO | ws://localhost:4000/signaling | Real-time |
| Prisma Studio | http://localhost:5555 | DB GUI |

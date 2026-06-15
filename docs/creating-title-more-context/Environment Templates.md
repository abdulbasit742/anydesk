# Environment Templates

This document outlines the environment variables and configuration settings required for different deployment environments (development, staging, production).

## Development Environment

```ini
# .env.development
DATABASE_URL="postgresql://user:password@localhost:5432/remotedesk_dev"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
SOCKET_IO_URL="http://localhost:3001"
TURN_SERVER_URL="turn:localhost:3478"
TURN_SERVER_SECRET="dev_turn_secret"
```

## Staging Environment

```ini
# .env.staging
DATABASE_URL="postgresql://user:password@staging-db-host:5432/remotedesk_staging"
NEXT_PUBLIC_API_BASE_URL="https://staging.remotedesk.com/api"
SOCKET_IO_URL="https://staging.remotedesk.com"
TURN_SERVER_URL="turn:staging-turn-host:3478"
TURN_SERVER_SECRET="staging_turn_secret"
```

## Production Environment

```ini
# .env.production
DATABASE_URL="postgresql://user:password@prod-db-host:5432/remotedesk_prod"
NEXT_PUBLIC_API_BASE_URL="https://app.remotedesk.com/api"
SOCKET_IO_URL="https://app.remotedesk.com"
TURN_SERVER_URL="turn:prod-turn-host:3478"
TURN_SERVER_SECRET="prod_turn_secret"
```

**Note:** All secrets and sensitive information should be managed securely using environment-specific secrets management systems, not committed directly to version control.

# RemoteDesk Local Development Environment Variables Guide

This guide details the environment variables required for local development of the RemoteDesk monorepo, covering the root, API, web, desktop applications, and Docker configurations. Proper environment variable setup is crucial for the correct functioning of all services.

## 1. Root `.env.example.review`

The root `.env.example.review` file provides common environment variables that might be shared across multiple applications or used by build tools. It serves as a template for your actual `.env` file at the monorepo root.

```ini
# Root .env.example.review

# General application environment (e.g., development, production, test)
NODE_ENV=development

# Secret key for JWTs or other cryptographic operations (replace with a strong, random value)
APP_SECRET=your_super_secret_key_here

# Base URL for the API service
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Base URL for the web dashboard
NEXT_PUBLIC_WEB_BASE_URL=http://localhost:3001

# Base URL for the desktop client (e.g., for deep linking or updates)
NEXT_PUBLIC_DESKTOP_BASE_URL=remotedesk://

# Docker Compose environment file for database and other services
DOCKER_ENV_FILE=.env.docker

# Optional: Sentry DSN for error tracking
SENTRY_DSN=

# Optional: Feature flags (example)
FEATURE_FLAG_CLIPBOARD_SYNC=true
FEATURE_FLAG_FILE_TRANSFER=true
```

## 2. API Service (`apps/api/.env.example.review`)

The API service requires environment variables for database connection, authentication, and external service integrations. This file serves as a template for `apps/api/.env`.

```ini
# apps/api/.env.example.review

# Inherit from root .env if using a system that supports it, or duplicate relevant variables
# NODE_ENV=development
# APP_SECRET=your_super_secret_key_here

# Database Connection (Prisma)
DATABASE_URL="mysql://user:password@localhost:3306/remotedesk_db"

# Redis Connection for caching, session management, or pub/sub
REDIS_URL="redis://localhost:6379"

# JWT Secret for API authentication (should be different from APP_SECRET for better security)
JWT_SECRET=another_strong_jwt_secret

# Port for the API server
PORT=3000

# CORS origins allowed to access the API (comma-separated)
CORS_ORIGINS=http://localhost:3001,remotedesk://

# TURN Server credentials for WebRTC (if self-hosting or using a specific provider)
TURN_SERVER_URL=turn:your.turn.server.com:3478
TURN_SERVER_USERNAME=turnuser
TURN_SERVER_PASSWORD=turnpassword

# Optional: Cloud storage for file uploads (e.g., S3 credentials)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

# Optional: Email service credentials
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

## 3. Web Dashboard (`apps/web/.env.example.review`)

The web dashboard (Next.js) needs environment variables for API endpoints, authentication, and public-facing configurations. This file serves as a template for `apps/web/.env`.

```ini
# apps/web/.env.example.review

# Publicly exposed API base URL (must match NEXT_PUBLIC_API_BASE_URL in root .env)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Publicly exposed Web base URL (must match NEXT_PUBLIC_WEB_BASE_URL in root .env)
NEXT_PUBLIC_WEB_BASE_URL=http://localhost:3001

# Next.js specific environment variables
# NEXT_PUBLIC_... variables are exposed to the browser

# Optional: Sentry DSN for client-side error tracking
NEXT_PUBLIC_SENTRY_DSN=

# Optional: Feature flags (must match root .env)
NEXT_PUBLIC_FEATURE_FLAG_CLIPBOARD_SYNC=true
NEXT_PUBLIC_FEATURE_FLAG_FILE_TRANSFER=true
```

## 4. Desktop Client (`apps/desktop/.env.example.review`)

The Electron desktop client requires environment variables for API endpoints, signaling server, and other client-specific configurations. This file serves as a template for `apps/desktop/.env`.

```ini
# apps/desktop/.env.example.review

# API base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Signaling server URL (Socket.IO)
VITE_SIGNALING_SERVER_URL=http://localhost:3000

# TURN Server credentials for WebRTC (if self-hosting or using a specific provider)
VITE_TURN_SERVER_URL=turn:your.turn.server.com:3478
VITE_TURN_SERVER_USERNAME=turnuser
VITE_TURN_SERVER_PASSWORD=turnpassword

# Optional: Sentry DSN for desktop client error tracking
VITE_SENTRY_DSN=

# Optional: Feature flags
VITE_FEATURE_FLAG_CLIPBOARD_SYNC=true
VITE_FEATURE_FLAG_FILE_TRANSFER=true
```

## 5. Docker Environment (`docker-compose.env.example.review`)

This file is used by `docker-compose.yml` to configure services like the database. It should be copied to `.env.docker` and customized.

```ini
# docker-compose.env.example.review

# Database Configuration
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=remotedesk_db
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_PORT=3306

# Redis Configuration
REDIS_PORT=6379

# Optional: Other Docker service specific variables
```

## Best Practices for Environment Variables

*   **Never commit `.env` files to version control.** Only commit `.env.example` or `.env.example.review` files.
*   **Use different values for different environments.** Production secrets should never be used in development.
*   **Prefix public variables.** For Next.js and Vite, use `NEXT_PUBLIC_` and `VITE_` prefixes respectively for variables exposed to the client-side.
*   **Document all variables.** Provide clear descriptions and example values for each variable.
*   **Rotate secrets regularly.** Especially for production environments.

---

**Author**: Manus AI
**Date**: June 12, 2026

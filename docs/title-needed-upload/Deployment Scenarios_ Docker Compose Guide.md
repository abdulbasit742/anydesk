# Deployment Scenarios: Docker Compose Guide

Docker Compose is the recommended tool for managing the multi-container RemoteDesk environment on a single host. It simplifies configuration, deployment, and scaling of the various services. This document provides a detailed guide and example configuration for using Docker Compose with RemoteDesk.

## 1. Overview

Using Docker Compose allows you to:
*   Define all services (API, Web, Signaling, DB, Redis) in a single file.
*   Manage environment variables and secrets consistently.
*   Set up networking and volume persistence easily.
*   Start and stop the entire stack with a single command.
*   Easily scale individual services (though limited on a single host).

## 2. Example `docker-compose.yml`

```yaml
version: '3.8'

services:
  # RemoteDesk API
  api:
    image: remotedesk/api:latest
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    networks:
      - remotedesk-net

  # RemoteDesk Web Application
  web:
    image: remotedesk/web:latest
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
    networks:
      - remotedesk-net

  # RemoteDesk Signaling Server
  signaling:
    image: remotedesk/signaling:latest
    build:
      context: .
      dockerfile: apps/signaling/Dockerfile
    environment:
      - REDIS_URL=redis://redis:6379
    networks:
      - remotedesk-net

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - remotedesk-net

  # Redis Cache and State
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - remotedesk-net

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
      - web
      - signaling
    networks:
      - remotedesk-net

networks:
  remotedesk-net:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

## 3. Environment Variable Management

Create a `.env` file in the same directory as your `docker-compose.yml` to store sensitive information and configuration:

```env
DOMAIN=yourdomain.com
DB_USER=remotedesk
DB_PASSWORD=your_secure_password
DB_NAME=remotedesk_db
JWT_SECRET=your_jwt_secret
```

## 4. Common Docker Compose Commands

*   **Start the stack:** `docker-compose up -d`
*   **Stop the stack:** `docker-compose down`
*   **View logs:** `docker-compose logs -f [service_name]`
*   **Rebuild images:** `docker-compose build`
*   **Restart a service:** `docker-compose restart [service_name]`
*   **Execute a command in a container:** `docker-compose exec [service_name] [command]`

## 5. Best Practices

*   **Use Specific Versions:** Avoid using `:latest` for production; use specific version tags for consistency.
*   **Resource Limits:** Set CPU and memory limits for each service to prevent one container from hogging all resources.
*   **Health Checks:** Implement health checks in your `docker-compose.yml` to ensure services are ready before they receive traffic.
*   **Separate Config and Data:** Use volumes for persistent data and bind mounts for configuration files.
*   **Security:** Run containers as non-root users whenever possible.

## 6. Related Documents

*   `deployment-single-vps.md`
*   `deployment-managed-postgres.md`
*   `deployment-redis.md`
*   `deployment-reverse-proxy.md`
*   `deployment-qa.md`

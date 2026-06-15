# Deployment Scenarios: Single VPS Deployment

A single Virtual Private Server (VPS) deployment is a cost-effective and simple way to host RemoteDesk for small-scale usage, development, or testing environments. This document outlines the steps to deploy the RemoteDesk backend, web application, and signaling server on a single Linux VPS.

## 1. Prerequisites

*   **A Linux VPS:** (e.g., Ubuntu 22.04 LTS) with at least 2 vCPUs and 4GB of RAM.
*   **A Domain Name:** Pointed to the VPS's public IP address.
*   **Docker and Docker Compose:** Installed on the VPS.
*   **Basic Linux Command Line Knowledge.**

## 2. Infrastructure Overview

In this scenario, all components run on the same VPS:
*   **Nginx:** Acts as a reverse proxy and handles SSL termination.
*   **RemoteDesk API:** Node.js/Express application.
*   **RemoteDesk Web App:** Next.js application (can be served via Nginx or run as a container).
*   **RemoteDesk Signaling Server:** Node.js/Socket.IO application.
*   **PostgreSQL:** Database for user and session data.
*   **Redis:** For session state, caching, and rate limiting.
*   **Coturn (Optional but Recommended):** For STUN/TURN functionality.

## 3. Deployment Steps

### 3.1. Server Preparation

1.  Update the system: `sudo apt update && sudo apt upgrade -y`.
2.  Install Docker and Docker Compose: Follow the official Docker documentation for Ubuntu.
3.  Set up a firewall (e.g., `ufw`): Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and the required WebRTC ports (UDP 1024-65535, 3478 for STUN/TURN).

### 3.2. Configuration and Docker Compose

1.  Create a project directory: `mkdir remotedesk-deploy && cd remotedesk-deploy`.
2.  Create a `.env` file with all necessary environment variables (database credentials, API keys, domain name, secrets).
3.  Create a `docker-compose.yml` file defining all the services (API, Web, Signaling, Postgres, Redis, Nginx, Coturn).

### 3.3. SSL with Let's Encrypt

Use Certbot with Nginx to obtain and automatically renew SSL certificates for your domain.

`sudo apt install certbot python3-certbot-nginx`
`sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com -d signaling.yourdomain.com`

### 3.4. Nginx Configuration

Configure Nginx to proxy requests to the appropriate containers:
*   `yourdomain.com` -> Web App container.
*   `api.yourdomain.com` -> API container.
*   `signaling.yourdomain.com` -> Signaling Server container (with WebSocket support).

### 3.5. Launching the Services

Run `docker-compose up -d` to build and start all the containers in detached mode.

## 4. Post-Deployment Tasks

*   **Database Migrations:** Run Prisma migrations to set up the database schema: `docker-compose exec api npx prisma migrate deploy`.
*   **Verify Services:** Check the logs for each container to ensure they started correctly: `docker-compose logs -f`.
*   **Test Connectivity:** Access the web dashboard, sign in, and test a remote session.
*   **Backup Strategy:** Set up regular backups for the PostgreSQL database.
*   **Monitoring:** Implement basic monitoring (e.g., using `uptime-kuma` or cloud provider tools) to ensure service availability.

## 5. Limitations of Single VPS Deployment

*   **Single Point of Failure:** If the VPS goes down, the entire system is unavailable.
*   **Limited Scalability:** Resources are shared among all components.
*   **Performance:** High traffic or many concurrent sessions can overwhelm the VPS.
*   **Geographical Latency:** Users far from the VPS location may experience higher latency.

## 6. When to Move Beyond a Single VPS

Consider a more robust deployment (e.g., managed services, multiple servers, Kubernetes) when:
*   You need higher availability and redundancy.
*   Traffic and session volume exceed the VPS's capacity.
*   You require better performance and lower latency for a global user base.
*   Management of individual components becomes too complex.

## 7. Related Documents

*   `deployment-docker-compose.md`
*   `deployment-managed-postgres.md`
*   `deployment-redis.md`
*   `deployment-coturn.md`
*   `deployment-reverse-proxy.md`
*   `deployment-ssl.md`
*   `deployment-qa.md`

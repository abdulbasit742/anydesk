# Backend Deployment Guide

This guide provides instructions for deploying the RemoteDesk backend API (`apps/api`) to a production environment.

## Prerequisites

-   A Linux server (e.g., Ubuntu, CentOS) or a container orchestration platform (e.g., Kubernetes, Docker Swarm).
-   Node.js (LTS version) and npm/yarn installed on the server, or Docker.
-   A PostgreSQL database instance.
-   Access to a secrets management system for sensitive environment variables.

## Deployment Options

### 1. Bare Metal / Virtual Machine Deployment

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd remotedesk/apps/api
    ```
2.  **Install dependencies:**
    ```bash
    yarn install --production
    # or npm install --production
    ```
3.  **Environment Variables:**
    Create a `.env` file or set environment variables directly on the server. Refer to `docs/release/environment-templates.md` for required variables.
4.  **Build the application:**
    ```bash
    yarn build
    # or npm run build
    ```
5.  **Run database migrations:**
    ```bash
    npx prisma migrate deploy
    ```
6.  **Start the application:**
    Use a process manager like PM2 to keep the application running and manage restarts.
    ```bash
    pm2 start dist/main.js --name remotedesk-api
    pm2 save
    ```
7.  **Configure a reverse proxy:**
    Use Nginx or Apache to proxy requests to the Node.js application and handle SSL termination.

### 2. Docker Deployment

1.  **Build the Docker image:**
    From the project root (`remotedesk/`):
    ```bash
    docker build -t remotedesk-api -f apps/api/Dockerfile .
    ```
2.  **Run the Docker container:**
    ```bash
    docker run -d --name remotedesk-api -p 3000:3000 \ 
      -e DATABASE_URL="<your-db-url>" \ 
      -e JWT_SECRET="<your-jwt-secret>" \ 
      remotedesk-api
    ```
    Ensure all necessary environment variables are passed.
3.  **Orchestration:**
    For production, use Docker Compose or Kubernetes for managing multiple containers, scaling, and service discovery.

## Post-Deployment Steps

-   **Monitoring:** Set up monitoring for CPU, memory, network, and application logs.
-   **Logging:** Ensure logs are centralized and accessible for debugging.
-   **Backups:** Implement regular database backups.
-   **Security:** Regularly update dependencies and apply security patches.

## Troubleshooting

-   **Application not starting:** Check logs for errors (`pm2 logs remotedesk-api` or `docker logs remotedesk-api`).
-   **Database connection issues:** Verify `DATABASE_URL` and database accessibility.
-   **API endpoints not reachable:** Check firewall rules and reverse proxy configuration.

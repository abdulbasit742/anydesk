# Developer Experience: Local Development Environment Setup Guide

This guide provides instructions for setting up a local development environment for the RemoteDesk project. A consistent and well-documented setup process is crucial for developer onboarding, productivity, and ensuring that development mirrors production as closely as possible.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your development machine:

*   **Git:** Version control system.
    *   [Download Git](https://git-scm.com/downloads)
*   **Node.js (LTS):** JavaScript runtime. We recommend using `nvm` (Node Version Manager) to manage Node.js versions.
    *   [Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
    *   Once `nvm` is installed, run: `nvm install --lts && nvm use --lts`
*   **pnpm:** Fast, disk space efficient package manager. (RemoteDesk uses a monorepo structure, and `pnpm` is preferred over `npm` or `yarn` for its efficiency with workspaces).
    *   `npm install -g pnpm`
*   **Docker & Docker Compose:** For running local database, Redis, and other services.
    *   [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
*   **VS Code (Recommended IDE):** With recommended extensions.
    *   [Download VS Code](https://code.visualstudio.com/download)

## 2. Project Setup

### 2.1. Clone the Repository

First, clone the RemoteDesk monorepo from GitHub:

```bash
git clone git@github.com:remotedesk/remotedesk.git
cd remotedesk
```

### 2.2. Install Dependencies

Install all project dependencies using `pnpm`:

```bash
pnpm install
```

This command will install dependencies for all workspaces (apps and packages) defined in the `pnpm-workspace.yaml` file.

### 2.3. Environment Variables

Create `.env` files for each application (`apps/api`, `apps/web`, `apps/desktop`) based on their respective `.env.example` files. These files will contain sensitive configuration like API keys, database connection strings, and other environment-specific settings.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/desktop/.env.example apps/desktop/.env
# Edit these .env files with your local development settings
```

**Important:** Never commit `.env` files to version control.

### 2.4. Database Setup (PostgreSQL with Docker Compose)

RemoteDesk uses PostgreSQL. For local development, we provide a `docker-compose.yml` file to spin up a local PostgreSQL and Redis instance.

```bash
docker compose up -d postgres redis
```

Once the database is running, apply Prisma migrations to set up the schema:

```bash
pnpm prisma migrate dev --name init
```

This will create the necessary tables in your local PostgreSQL database.

## 3. Running the Applications

### 3.1. Backend API

Navigate to the `apps/api` directory and start the development server:

```bash
cd apps/api
pnpm dev
```

The API server will typically run on `http://localhost:3000`.

### 3.2. Web Application

Navigate to the `apps/web` directory and start the development server:

```bash
cd apps/web
pnpm dev
```

The web application will typically run on `http://localhost:3001`.

### 3.3. Desktop Application

Navigate to the `apps/desktop` directory and start the development application:

```bash
cd apps/desktop
pnpm dev
```

The Electron desktop application will launch.

## 4. Recommended VS Code Extensions

To enhance your development experience, install the following VS Code extensions:

*   **ESLint:** For linting TypeScript/JavaScript code.
*   **Prettier:** For consistent code formatting.
*   **TypeScript Vue Plugin (Volar):** If working with Vue components.
*   **Docker:** For managing Docker containers.
*   **Prisma:** For Prisma schema highlighting and formatting.

## 5. Troubleshooting

*   **`pnpm install` fails:** Ensure `pnpm` is installed globally (`npm install -g pnpm`). Check your Node.js version.
*   **Database connection issues:** Verify Docker containers are running (`docker ps`). Check database credentials in `apps/api/.env`.
*   **Port conflicts:** If an application fails to start due to a port conflict, check if another process is using the port and terminate it, or change the port in the `.env` file.

## 6. Related Documents

*   `eslint-config.md`
*   `prettier-config.md`
*   `typescript-strictness.md`
*   `ci-cd-pipeline-best-practices.md`
*   `configuration-management-strategy.md`

# RemoteDesk Local Setup: Windows PowerShell Run Guide

This guide provides instructions for setting up and running the RemoteDesk monorepo on a Windows environment using PowerShell. It covers prerequisites, repository cloning, dependency installation, and starting the various services.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Git**: For cloning the repository. Download from [git-scm.com](https://git-scm.com/download/win).
*   **Node.js (LTS)**: Includes npm (Node Package Manager). Download from [nodejs.org](https://nodejs.org/en/download/). It is recommended to use the LTS version.
*   **Yarn (Optional, but recommended for monorepos)**: A fast, reliable, and secure dependency management tool. Install globally via npm: `npm install -g yarn`.
*   **Docker Desktop**: Required for running the database (MySQL/TiDB) and potentially other services via Docker Compose. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
*   **PowerShell 7 (Optional, but recommended)**: While Windows PowerShell will work, PowerShell 7 (pwsh) offers improved features and cross-platform compatibility. Download from [docs.microsoft.com/powershell/scripting/install/installing-powershell-on-windows](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows).

## 1. Clone the Repository

Open PowerShell and clone the RemoteDesk monorepo:

```powershell
git clone https://github.com/your-org/remotedesk.git # Replace with actual repository URL
cd remotedesk
```

## 2. Install Dependencies

Navigate to the root of the monorepo and install all project dependencies. If you have Yarn installed, it is recommended to use it.

### Using Yarn (Recommended)

```powershell
yarn install
```

### Using npm

```powershell
npm install
```

This command will install dependencies for all workspaces (`apps/api`, `apps/web`, `apps/desktop`, `packages/shared`).

## 3. Database Setup with Docker Compose

RemoteDesk uses a database (e.g., MySQL/TiDB) which can be easily set up using Docker Compose. Ensure Docker Desktop is running.

1.  **Create `.env` file**: Copy the example Docker environment file and customize it if necessary. Refer to `docs/development/env-vars.md` for details.
    ```powershell
    Copy-Item docker-compose.env.example .env.docker
    # Edit .env.docker if needed
    ```
2.  **Start Database**: Use Docker Compose to bring up the database service.
    ```powershell
    docker-compose -f docker-compose.yml --env-file .env.docker up -d db
    ```
    This will start the database in the background.

3.  **Run Prisma Migrations**: Once the database is running, apply the Prisma migrations to set up the database schema.
    ```powershell
    # Ensure your API .env file is configured correctly for database connection
    yarn workspace @remotedesk/api prisma migrate dev --name init
    # Or if using npm
    npm run prisma migrate dev --name init --workspace=@remotedesk/api
    ```
    Refer to the Prisma generate/migrate guide for more details.

## 4. Environment Variables

Each application (`apps/api`, `apps/web`, `apps/desktop`) requires its own environment variables. Copy the example `.env` files and populate them.

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
Copy-Item apps/desktop/.env.example apps/desktop/.env
# Populate these .env files with appropriate values. Refer to docs/development/env-vars.md
```

## 5. Start the Services

You can start each service individually or use a monorepo task runner (like Turborepo, if configured) to start them concurrently.

### 5.1 Start API Service

```powershell
cd apps/api
yarn dev # Or npm run dev
```

### 5.2 Start Web Dashboard

```powershell
cd apps/web
yarn dev # Or npm run dev
```

### 5.3 Start Desktop Client

```powershell
cd apps/desktop
yarn dev # Or npm run dev
```

## 6. Accessing the Applications

*   **API**: Typically runs on `http://localhost:3000` (or as configured).
*   **Web Dashboard**: Accessible via your browser, usually `http://localhost:3001` (or as configured).
*   **Desktop Client**: The Electron application will launch in a new window.

## Troubleshooting

Refer to `docs/troubleshooting/common-errors.md` for solutions to common issues.

---

**Author**: Manus AI
**Date**: June 12, 2026

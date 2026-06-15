# RemoteDesk Local Development Setup Guide

This guide provides instructions for setting up your local development environment for the RemoteDesk project.

## Prerequisites

Ensure you have the following software installed on your machine:

-   **Git:** For version control.
-   **Node.js (LTS version):** We recommend using `nvm` (Node Version Manager) to manage Node.js versions.
    ```bash
    # Install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    # Install Node.js LTS
    nvm install --lts
    nvm use --lts
    ```
-   **Yarn:** Our preferred package manager.
    ```bash
    npm install -g yarn
    ```
-   **Docker & Docker Compose:** For running the PostgreSQL database and potentially other services.
-   **PostgreSQL Client:** (Optional) For direct database interaction.
-   **VS Code (Recommended IDE):** With extensions for TypeScript, ESLint, Prettier, and React.

## 1. Clone the Repository

First, clone the RemoteDesk monorepo to your local machine:

```bash
git clone <your-repo-url>
cd remotedesk
```

## 2. Install Dependencies

Install all project dependencies for the monorepo:

```bash
yarn install
```

This command will install dependencies for all `apps/*` and `packages/*` workspaces.

## 3. Database Setup (PostgreSQL with Docker)

We use PostgreSQL as our primary database. The easiest way to get it running locally is with Docker Compose.

1.  **Create a `.env` file** in the `remotedesk/apps/api` directory with your database connection string:
    ```ini
    # remotedesk/apps/api/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/remotedesk_dev"
    ```
    *Note: Replace `user`, `password`, and `remotedesk_dev` with your desired credentials and database name.*

2.  **Start the PostgreSQL container:**
    Create a `docker-compose.yml` file in the project root (`remotedesk/`) (if not already present) or use an existing one:
    ```yaml
    # remotedesk/docker-compose.yml
    version: '3.8'
    services:
      db:
        image: postgres:14
        restart: always
        environment:
          POSTGRES_USER: user
          POSTGRES_PASSWORD: password
          POSTGRES_DB: remotedesk_dev
        ports:
          - "5432:5432"
        volumes:
          - db-data:/var/lib/postgresql/data
    volumes:
      db-data:
    ```
    Then run:
    ```bash
    docker-compose up -d db
    ```

3.  **Run Prisma Migrations:**
    Navigate to the `apps/api` directory and apply the database migrations:
    ```bash
    cd apps/api
    npx prisma migrate dev --name init
    cd ../..
    ```

## 4. Environment Variables

Each application (`apps/api`, `apps/web`, `apps/desktop`) may require its own `.env` file for local development. Refer to `docs/release/environment-templates.md` for a list of required variables.

-   **`apps/api/.env`:**
    ```ini
    DATABASE_URL="postgresql://user:password@localhost:5432/remotedesk_dev"
    JWT_SECRET="supersecretjwtkey"
    SOCKET_IO_SECRET="supersecretsocketkey"
    ```
-   **`apps/web/.env.local`:**
    ```ini
    NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
    NEXT_PUBLIC_SOCKET_IO_URL="http://localhost:3001"
    ```

## 5. Running the Applications

### Backend API

```bash
cd apps/api
yarn dev
# or npm run dev
```
This will start the API server, typically on `http://localhost:3000`.

### Web Application

```bash
cd apps/web
yarn dev
# or npm run dev
```
This will start the Next.js development server, typically on `http://localhost:3000` (ensure the API is on a different port or proxied).

### Desktop Application

```bash
cd apps/desktop
yarn electron:serve
# or npm run electron:serve
```
This will launch the Electron application in development mode.

## 6. Running Tests

To run tests for all packages:

```bash
yarn test
# or npm test
```

To run tests for a specific package (e.g., `apps/api`):

```bash
yarn workspace api test
# or npm workspace api test
```

## 7. Linting and Formatting

```bash
yarn lint
yarn format
```

## Troubleshooting

Refer to the [Troubleshooting Guide](docs/release/troubleshooting.md) for common issues and solutions.

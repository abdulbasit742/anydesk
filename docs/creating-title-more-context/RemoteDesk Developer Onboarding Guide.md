# RemoteDesk Developer Onboarding Guide

This guide provides new developers with the necessary information to get started with the RemoteDesk project, understand its structure, and begin contributing effectively.

## 1. Project Overview

RemoteDesk is a full-stack remote desktop application. It's built as a monorepo containing a web dashboard, a desktop application, a backend API, and shared utilities. Familiarize yourself with the [Architecture Overview](docs/architecture/overview.md) to understand the system's high-level design.

## 2. Monorepo Structure

The project is organized into the following main directories:

-   `apps/api`: Backend services (Node.js, Express, Prisma, PostgreSQL, Socket.IO).
-   `apps/web`: Web dashboard (Next.js, React, TypeScript, TailwindCSS).
-   `apps/desktop`: Desktop application (Electron, React, TypeScript, WebRTC).
-   `packages/shared`: Reusable code, types, and utilities.
-   `docs`: Project documentation.

## 3. Local Development Setup

Follow the [Local Setup Guide](docs/development/local-setup.md) to get your development environment configured and all services running.

## 4. Key Technologies

Familiarity with the following technologies is beneficial:

-   **TypeScript:** All new code should be written in TypeScript.
-   **Node.js & npm/Yarn:** For package management and running backend/build processes.
-   **React & Next.js:** For building user interfaces (web and desktop).
-   **Electron:** For the desktop application.
-   **WebRTC & Socket.IO:** For real-time communication and signaling.
-   **Prisma & PostgreSQL:** For database interactions.
-   **Git:** For version control.

## 5. Code Standards and Practices

-   **Linting & Formatting:** We use ESLint and Prettier to maintain consistent code style. Ensure your IDE is configured to use them, or run `yarn lint` and `yarn format` before committing.
-   **Testing:** Write unit, integration, and end-to-end tests for new features and bug fixes. Refer to the [Test Coverage Documentation](docs/testing/coverage.md) and [QA Documentation](docs/testing/qa-docs.md).
-   **Commit Messages:** Follow Conventional Commits specification for clear and consistent commit history.
-   **Pull Requests:** All changes must go through a pull request review process. Ensure your PRs are small, focused, and well-described.

## 6. Contributing Workflow

1.  **Fork the repository** and clone it locally.
2.  **Create a new branch** for your feature or bug fix (e.g., `feature/add-device-rename`, `fix/login-bug`).
3.  **Implement your changes**, writing tests as appropriate.
4.  **Ensure all tests pass** and linting checks are clean.
5.  **Commit your changes** with a descriptive message.
6.  **Push your branch** to your fork.
7.  **Open a Pull Request** against the `develop` branch of the main repository.

## 7. Communication

-   **Slack/Discord:** Join our internal communication channels for real-time discussions.
-   **Jira/Linear:** Use our project management tool for task tracking and issue reporting.
-   **GitHub Issues:** For external bug reports or feature requests.

## 8. Further Reading

-   [Backend API Reference](docs/api/api-reference.md - *TODO: Create this file*)
-   [Socket.IO Reference](docs/api/socket-reference.md - *TODO: Create this file*)
-   [Desktop Internals](docs/development/desktop-internals.md - *TODO: Create this file*)
-   [Security Model](docs/security/security-model.md - *TODO: Create this file*)
-   [Permission Model](docs/security/permission-model.md - *TODO: Create this file*)
-   [Production Runbook](docs/operations/production-runbook.md - *TODO: Create this file*)
-   [Next Engineering Roadmap](docs/roadmap/next-engineering-roadmap.md - *TODO: Create this file*)

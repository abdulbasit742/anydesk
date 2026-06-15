# Environment Variable Management for RemoteDesk

Effective management of environment variables is crucial for configuring the RemoteDesk application across different deployment environments (development, staging, production). This document outlines the strategy for handling sensitive and configuration-specific variables.

## 1. Principles

*   **Separation of Configuration**: Configuration should be externalized from the codebase, allowing the same application build to be deployed to multiple environments with different settings.
*   **Security**: Sensitive information (API keys, database credentials) must be stored and accessed securely, never committed directly to version control.
*   **Consistency**: A consistent approach to naming and accessing environment variables should be maintained across all services.

## 2. Environment-Specific Configuration

### 2.1. Local Development (`.env` files)

For local development, `.env` files are used to store environment variables. These files are typically ignored by Git (`.gitignore`) to prevent sensitive data from being committed.

*   **Root `.env`**: For variables common to the entire monorepo.
*   **Service-specific `.env`**: For variables specific to a particular application (e.g., `apps/api/.env`, `apps/web/.env`, `apps/desktop/.env`).
*   **`.env.example`**: A template file (e.g., `.env.example.review`) should be provided for each `.env` file, listing all required variables with placeholder values. This helps new developers set up their environment quickly.

### 2.2. CI/CD Environments (GitHub Actions Secrets)

In CI/CD pipelines (e.g., GitHub Actions), environment variables are managed using the platform's secret management features.

*   **GitHub Secrets**: Sensitive variables like `VERCEL_TOKEN`, `AWS_ACCESS_KEY_ID`, `DATABASE_URL` are stored as GitHub Secrets and injected into the workflow at runtime.
*   **Environment Variables in Workflow**: Non-sensitive configuration can be defined directly in the workflow file using the `env` keyword.

### 2.3. Production Environments

#### 2.3.1. AWS ECS

For API services deployed on AWS ECS, environment variables are managed through a combination of Task Definition environment variables and AWS Secrets Manager.

*   **Task Definition**: Non-sensitive variables can be directly defined in the ECS Task Definition.
*   **AWS Secrets Manager**: Sensitive variables (e.g., `DATABASE_URL`, `REDIS_URL`, `AWS_SECRET_ACCESS_KEY`) are stored in AWS Secrets Manager and referenced in the Task Definition. ECS then injects these values securely into the container at runtime.

#### 2.3.2. Kubernetes

For deployments on Kubernetes, environment variables are managed using ConfigMaps and Secrets.

*   **ConfigMaps**: Used for non-sensitive configuration data (e.g., feature flags, log levels).
*   **Secrets**: Used for sensitive data (e.g., database credentials, API keys). Kubernetes Secrets store this data in base64 encoded format (though it's still recommended to use external secret management solutions like HashiCorp Vault or cloud provider secrets for true security).

#### 2.3.3. Vercel (Web Application)

Vercel provides its own mechanism for managing environment variables for web deployments.

*   **Project Environment Variables**: Variables are configured directly within the Vercel project settings, with separate values for development, preview, and production environments.
*   **Encrypted**: Vercel encrypts sensitive environment variables at rest.

## 3. Best Practices

*   **Never Commit Secrets**: Ensure `.env` files are in `.gitignore` and never commit sensitive information to version control.
*   **Least Privilege**: Grant only the necessary permissions to access environment variables and secrets.
*   **Rotation**: Regularly rotate sensitive credentials (e.g., database passwords, API keys).
*   **Auditing**: Implement auditing for access to secrets and environment configurations.
*   **Documentation**: Clearly document all environment variables, their purpose, and how they are managed in each environment.

By following these guidelines, RemoteDesk can maintain a secure, flexible, and manageable configuration across its entire ecosystem.

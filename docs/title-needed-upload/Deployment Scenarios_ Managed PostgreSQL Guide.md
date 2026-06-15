# Deployment Scenarios: Managed PostgreSQL Guide

For production environments, using a managed PostgreSQL service (e.g., AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL, DigitalOcean Managed Databases) is highly recommended over running PostgreSQL in a container. Managed services provide better reliability, automated backups, high availability, and easier scaling. This document outlines how to integrate a managed PostgreSQL database with RemoteDesk.

## 1. Benefits of Managed PostgreSQL

*   **High Availability:** Automatic failover to standby instances.
*   **Automated Backups:** Point-in-time recovery and regular automated backups.
*   **Security:** Managed security patches, encryption at rest, and integrated IAM.
*   **Scaling:** Easy vertical and horizontal scaling (read replicas).
*   **Monitoring:** Integrated performance monitoring and alerting.

## 2. Configuration Steps

### 2.1. Provision the Database

1.  Create a PostgreSQL instance in your chosen cloud provider.
2.  Select a version compatible with RemoteDesk (PostgreSQL 14 or 15 is recommended).
3.  Configure the instance size (vCPU, RAM, Storage) based on your expected load.
4.  Enable automated backups and high availability (for production).

### 2.2. Network Configuration

1.  Ensure your application servers (VPS, Kubernetes, etc.) can reach the database instance.
2.  Use a private network (VPC) whenever possible.
3.  Configure security groups or firewall rules to allow traffic only from your application's IP addresses on port 5432.

### 2.3. Database and User Setup

1.  Connect to the managed instance using a tool like `psql` or `pgAdmin`.
2.  Create a dedicated database for RemoteDesk: `CREATE DATABASE remotedesk_db;`.
3.  Create a dedicated user with appropriate permissions:
    ```sql
    CREATE USER remotedesk_user WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE remotedesk_db TO remotedesk_user;
    ```

### 2.4. Update Application Configuration

Update the `DATABASE_URL` environment variable in your RemoteDesk API configuration:

`DATABASE_URL="postgresql://remotedesk_user:your_secure_password@your-db-hostname.com:5432/remotedesk_db?sslmode=require"`

**Note:** Always use `sslmode=require` (or `verify-full`) for managed databases to ensure encrypted connections.

## 3. Database Migrations

When using a managed database, you can still run Prisma migrations from your deployment pipeline or a temporary container:

`npx prisma migrate deploy`

Ensure the environment running the migration has network access to the managed database.

## 4. Performance Tuning

*   **Connection Pooling:** Use a connection pooler like `pgBouncer` (either managed by the cloud provider or self-hosted) to handle a large number of concurrent connections efficiently.
*   **Index Optimization:** Regularly review and optimize database indexes based on query performance.
*   **Read Replicas:** For read-heavy workloads, consider using read replicas to offload traffic from the primary instance.

## 5. Related Documents

*   `deployment-single-vps.md`
*   `deployment-docker-compose.md`
*   `backend-reliability-transactions.md`
*   `backend-reliability-timeouts.md`
*   `deployment-qa.md`

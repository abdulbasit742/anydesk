# Deployment Scenarios: Redis Deployment Guide

Redis is used in RemoteDesk for session state management, caching, rate limiting, and as a message broker for Socket.IO. Ensuring a reliable Redis deployment is essential for the overall stability and performance of the system. This document covers different Redis deployment options.

## 1. Deployment Options

### 1.1. Containerized Redis (Single Node)

Suitable for small deployments, development, and testing.

*   **Pros:** Simple to set up (especially with Docker Compose), low cost.
*   **Cons:** Single point of failure, no automatic failover, limited scalability.
*   **Implementation:** See `deployment-docker-compose.md`.

### 1.2. Managed Redis (e.g., AWS ElastiCache, Google Cloud Memorystore)

Recommended for production environments.

*   **Pros:** High availability (Multi-AZ), automated backups, managed patching, easy scaling.
*   **Cons:** Higher cost than self-hosting on a VPS.
*   **Configuration:** Similar to managed Postgres, you obtain a connection URL and configure it in your application.

### 1.3. Redis Sentinel / Cluster (Self-Hosted)

For high availability and scalability on self-hosted infrastructure.

*   **Sentinel:** Provides high availability with automatic failover for a master-slave setup.
*   **Cluster:** Provides horizontal scaling by partitioning data across multiple nodes.
*   **Note:** These are more complex to set up and manage than a single node or managed service.

## 2. Configuration Best Practices

### 2.1. Persistence

Decide on the appropriate persistence model:
*   **RDB (Redis Database):** Periodic snapshots of the dataset. Good for backups.
*   **AOF (Append Only File):** Logs every write operation. Better for durability but can impact performance.
*   **Recommendation:** Use both RDB and AOF for production for a balance of performance and durability.

### 2.2. Memory Management

*   **`maxmemory`:** Always set a maximum memory limit for Redis to prevent it from consuming all system RAM.
*   **`maxmemory-policy`:** Choose an appropriate eviction policy (e.g., `allkeys-lru` or `volatile-lru`) when the memory limit is reached.

### 2.3. Security

*   **Authentication:** Always enable password authentication using the `requirepass` directive.
*   **Network Isolation:** Ensure Redis is only accessible from your application servers via a private network.
*   **Disable Dangerous Commands:** Use `rename-command` to disable or rename dangerous commands like `FLUSHALL`, `CONFIG`, and `KEYS`.

## 3. Application Integration

Update the `REDIS_URL` environment variable in your RemoteDesk API and Signaling Server configurations:

`REDIS_URL="redis://:your_secure_password@your-redis-hostname.com:6379"`

## 4. Monitoring

*   **Key Metrics:** Monitor memory usage, hit/miss ratio, number of connected clients, and command throughput.
*   **Tools:** Use `redis-cli info`, Prometheus with Redis Exporter, or cloud-specific monitoring tools.

## 5. Related Documents

*   `deployment-single-vps.md`
*   `deployment-docker-compose.md`
*   `backend-reliability-rate-limiting.md`
*   `backend-reliability-socket-cleanup.md`
*   `deployment-qa.md`

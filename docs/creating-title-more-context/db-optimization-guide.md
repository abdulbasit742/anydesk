# RemoteDesk Backend Database Optimization Guide

This guide provides best practices and strategies for optimizing the PostgreSQL database used by the RemoteDesk backend API.

## 1. Indexing Strategy

Proper indexing is crucial for query performance. Identify columns frequently used in `WHERE` clauses, `JOIN` conditions, `ORDER BY` clauses, and `GROUP BY` clauses.

-   **Primary Keys & Foreign Keys:** PostgreSQL automatically creates indexes for primary keys. Ensure foreign keys are also indexed.
-   **Frequently Queried Columns:** Create B-tree indexes on columns that are often searched or filtered.
-   **Compound Indexes:** For queries involving multiple columns in `WHERE` clauses, consider creating compound indexes (e.g., `CREATE INDEX idx_user_device ON "Device" ("userId", "lastSeen");`). The order of columns in a compound index matters.
-   **Partial Indexes:** If a table has many rows but only a small subset is frequently queried (e.g., `WHERE status = 'active'`), a partial index can be more efficient (`CREATE INDEX idx_active_sessions ON "Session" ("id") WHERE status = 'active';`).
-   **Expression Indexes:** For queries that involve functions or expressions (e.g., `WHERE lower(email) = '...'`), create an index on the expression itself (`CREATE INDEX idx_lower_email ON "User" (lower(email));`).

## 2. Query Optimization

-   **Avoid `SELECT *`:** Always specify the columns you need. This reduces disk I/O and network traffic.
-   **Use `EXPLAIN ANALYZE`:** This powerful PostgreSQL command shows the query plan and execution statistics, helping to identify bottlenecks.
    ```sql
    EXPLAIN ANALYZE SELECT id, name FROM "Device" WHERE "userId" = 'some_user_id' ORDER BY "lastSeen" DESC;
    ```
-   **Limit Results:** Use `LIMIT` with `ORDER BY` to retrieve only the necessary number of rows, especially for pagination.
-   **Optimize `JOIN` Operations:** Ensure `JOIN` conditions use indexed columns. Consider `LATERAL JOIN` for complex subqueries.
-   **Batch Operations:** For bulk inserts, updates, or deletes, use single statements or batch operations instead of many individual statements.
-   **Avoid N+1 Queries:** Use eager loading (e.g., Prisma `include` or `select`) to fetch related data in a single query instead of making N additional queries.

## 3. Connection Pooling

-   **Prisma Connection Pool:** Prisma manages its own connection pool. Configure the pool size via the connection string (e.g., `DATABASE_URL="postgresql://user:password@host:port/db?pool_timeout=10&pool_max=10"`).
-   **External Connection Poolers (PgBouncer):** For high-concurrency applications, consider using an external connection pooler like PgBouncer. It sits between your application and PostgreSQL, managing a pool of connections and reducing the overhead of establishing new connections.

## 4. Database Maintenance

-   **`VACUUM` and `ANALYZE`:** Regularly run `VACUUM` (or `AUTOVACUUM`) to reclaim storage occupied by dead tuples and `ANALYZE` to update statistics used by the query planner. This is critical for preventing table bloat and ensuring efficient query plans.
-   **Monitoring:** Monitor database health, including CPU, memory, disk I/O, active connections, and slow queries. Tools like Prometheus/Grafana or cloud provider monitoring services are invaluable.

## 5. Hardware and Configuration

-   **Hardware:** Ensure the database server has sufficient CPU, RAM, and fast storage (SSDs).
-   **PostgreSQL Configuration (`postgresql.conf`):** Tune parameters like `shared_buffers`, `work_mem`, `maintenance_work_mem`, `wal_buffers`, and `max_connections` based on your server's resources and workload.

By following these guidelines, you can significantly improve the performance and scalability of the RemoteDesk backend database.

# Database Capacity Planning

## Storage per Entity
| Entity | Rows | Size/Row | Total |
|--------|------|----------|-------|
| Users | 10,000 | 500 B | 5 MB |
| Sessions (active) | 1,000 | 1 KB | 1 MB |
| Sessions (historical) | 1M | 1 KB | 1 GB |
| Audit logs | 10M | 500 B | 5 GB |
| Devices | 50,000 | 300 B | 15 MB |
| Messages | 100M | 200 B | 20 GB |

## Growth Projections
| Year | Users | Sessions | Storage |
|------|-------|----------|---------|
| Y1 | 10K | 1M | 30 GB |
| Y2 | 50K | 10M | 300 GB |
| Y3 | 200K | 50M | 1.5 TB |

## Connection Pooling
| App Instances | Pool Size | Total DB Conns |
|--------------|-----------|----------------|
| 2 | 20 | 40 |
| 5 | 20 | 100 |
| 10 | 20 | 200 |
| 20 | 20 | 400 |

## Scaling Strategy
1. **Vertical**: Larger instance (up to db.r6g.16xlarge)
2. **Read Replicas**: For reporting, dashboard queries
3. **Sharding**: By org_id for multi-tenant
4. **Archive**: Old audit logs to cold storage

## Performance Targets
| Query Type | p95 Latency |
|------------|-------------|
| Simple lookup | < 10ms |
| Join query | < 50ms |
| Report query | < 5s (read replica) |
| Write | < 20ms |

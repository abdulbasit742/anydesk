# Redis Capacity Planning

## Memory Usage
| Data Type | Count | Size/Item | Total |
|-----------|-------|-----------|-------|
| Session cache | 1,000 | 2 KB | 2 MB |
| Rate limit counters | 50,000 | 100 B | 5 MB |
| Presence data | 10,000 | 500 B | 5 MB |
| WebSocket room mappings | 1,000 | 1 KB | 1 MB |

## Instance Sizing
| Users | Memory | Instance |
|-------|--------|----------|
| 1K | 50 MB | cache.t3.micro |
| 10K | 200 MB | cache.t3.small |
| 50K | 1 GB | cache.r6g.large |
| 100K | 2 GB | cache.r6g.xlarge |
| 500K | 10 GB | cache.r6g.2xlarge |

## Eviction Policy
```
maxmemory-policy allkeys-lru
```

## Persistence
```
save 900 1
save 300 10
save 60 10000
appendonly yes
```

## High Availability
- Redis Sentinel for auto-failover
- Or Redis Cluster for sharding
- Cross-AZ replication

## Monitoring
- Memory usage: `INFO memory`
- Hit rate: `INFO stats` (keyspace_hits / (keyspace_hits + keyspace_misses))
- Eviction rate: `INFO stats` (evicted_keys)
- Connected clients: `INFO clients`

# Cache Strategy

## Layers
| Layer | Type | TTL | Purpose |
|-------|------|-----|---------|
| L1 | In-memory | 5 min | Hot data |
| L2 | Redis | 15 min | Warm data |
| L3 | Database | Permanent | Persistent |

## Invalidation
- Write-through for critical data
- TTL for session data
- Event-driven for real-time

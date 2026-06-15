# Performance Budget

## Bundle Sizes
| Package | Max Size | Gzipped |
|---------|----------|---------|
| Web app entry | 250KB | 80KB |
| Web app total | 1MB | 350KB |
| Desktop renderer | 500KB | 150KB |
| Shared package | 50KB | 15KB |

## API Response Times
| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| /health | 10ms | 50ms | 100ms |
| /auth/* | 100ms | 300ms | 500ms |
| /devices | 50ms | 200ms | 400ms |
| Socket connect | 50ms | 150ms | 300ms |

## Database
| Query | Max Time |
|-------|----------|
| User lookup | 10ms |
| Device list | 20ms |
| Audit log query | 50ms |
| Insert audit log | 5ms |

## Enforcement
- CI checks bundle size on build
- Lighthouse CI fails on budget breach
- Load tests fail on p95 > 500ms

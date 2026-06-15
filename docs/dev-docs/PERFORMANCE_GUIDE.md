# Performance Guide

## Frontend
### Code Splitting
```typescript
const AdminPage = lazy(() => import('./pages/Admin'));

<Suspense fallback={<Skeleton />}>
  <AdminPage />
</Suspense>
```

### Memoization
```typescript
const MemoizedComponent = React.memo(MyComponent);

const expensiveValue = useMemo(() => compute(data), [data]);

const handler = useCallback(() => doSomething(), []);
```

### Virtual Lists
For long lists, use virtualization:
```tsx
import { VirtualList } from '@/components/ui/virtual-list';

<VirtualList items={items} renderItem={renderItem} />
```

## Backend
### Database
- Use indexes for frequent queries
- N+1 query prevention
- Connection pooling

### Caching
```typescript
const cached = await cache.get(key);
if (cached) return cached;

const result = await db.query(...);
await cache.set(key, result, 60); // 60s TTL
```

## WebRTC
### Quality Tiers
| Quality | Resolution | FPS | Bitrate |
|---------|-----------|-----|---------|
| Low | 854x480 | 15 | 500kbps |
| Medium | 1280x720 | 24 | 1.5Mbps |
| High | 1920x1080 | 30 | 3Mbps |

### Adaptive Quality
Monitor bandwidth and adjust quality dynamically.

## Benchmarks
- Page load: < 2s
- TTI: < 3s
- Connection setup: < 5s
- Frame latency: < 100ms

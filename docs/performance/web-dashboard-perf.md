# Web Dashboard Performance

## Metrics
| Metric | Target | Budget |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | 1.0s |
| Largest Contentful Paint | < 2.5s | 2.0s |
| Time to Interactive | < 3.5s | 3.0s |
| Cumulative Layout Shift | < 0.1 | 0.05 |
| Total Blocking Time | < 200ms | 150ms |

## Scripts
```bash
# Lighthouse CI
lhci autorun --config=lighthouserc.js

# Web Vitals
npm run test:web-vitals
```

## Monitoring
- Real User Monitoring (RUM) via web-vitals library
- Performance.mark/measure for custom metrics
- Long task monitoring

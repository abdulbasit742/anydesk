# RemoteDesk Customer Health Score

## Score Components
| Factor | Weight | Measurement |
|--------|--------|-------------|
| Login Frequency | 25% | Days with login in last 30 |
| Session Usage | 25% | Sessions per week |
| Feature Adoption | 20% | Features used / Total available |
| NPS Score | 15% | Latest NPS response |
| Support Tickets | 10% | Tickets in last 30 days (inverse) |
| License Utilization | 5% | Active seats / Total seats |

## Score Ranges
| Score | Health | Action |
|-------|--------|--------|
| 80-100 | Healthy | Nurture, expand |
| 60-79 | At Risk | Check-in, offer help |
| 40-59 | Unhealthy | Intervention required |
| 0-39 | Critical | Executive escalation |

## Calculation
```typescript
function calculateHealthScore(metrics: HealthMetrics): number {
  const loginScore = (metrics.loginDays / 30) * 100;
  const sessionScore = Math.min(metrics.sessionsPerWeek / 5, 1) * 100;
  const adoptionScore = (metrics.featuresUsed / metrics.totalFeatures) * 100;
  const npsScore = ((metrics.nps + 100) / 200) * 100; // Normalize -100 to 100
  const ticketScore = Math.max(0, 100 - metrics.ticketsLast30Days * 10);
  const licenseScore = (metrics.activeSeats / metrics.totalSeats) * 100;

  return (
    loginScore * 0.25 +
    sessionScore * 0.25 +
    adoptionScore * 0.20 +
    npsScore * 0.15 +
    ticketScore * 0.10 +
    licenseScore * 0.05
  );
}
```

## Alerts
- Health score drops below 60: CSM notified
- Health score drops below 40: Manager notified
- Score increases 20+ points: Celebrate with team

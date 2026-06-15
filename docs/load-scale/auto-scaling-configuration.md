# Auto-Scaling Configuration

## Metrics
- CPU utilization > 70%
- Memory utilization > 80%
- Request queue depth > 100

## Behavior
- Scale out: +2 instances
- Scale in: -1 instance
- Cooldown: 5 minutes

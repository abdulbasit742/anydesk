# Infrastructure Monitoring Setup

## Prometheus Targets
```yaml
scrape_configs:
  - job_name: 'remotedesk-api'
    static_configs:
      - targets: ['api:4000']
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: 'remotedesk-node'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
```

## Grafana Dashboards
- API Overview (request rate, latency, errors)
- Database Performance (connections, query time)
- WebRTC Metrics (connections, bandwidth, failures)
- Infrastructure (CPU, memory, disk, network)

## Alertmanager Rules
```yaml
groups:
  - name: remotedesk
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
```

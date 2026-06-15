# Infrastructure QA Checklist

## Backup
- [ ] Automated backups complete daily
- [ ] Backup restoration tested monthly
- [ ] Backup integrity verified
- [ ] Offsite backup replication works
- [ ] Backup encryption validated

## Monitoring
- [ ] All services have health checks
- [ ] Alerts trigger within SLA
- [ ] Alert fatigue managed
- [ ] Runbooks linked to alerts
- [ ] Dashboards reviewed weekly

## Scaling
- [ ] Auto-scaling triggers work
- [ ] Scale-up: < 2 minutes
- [ ] Scale-down: graceful
- [ ] DB connection limits not exceeded
- [ ] Cache eviction policy appropriate

## Security
- [ ] OS patches applied within 7 days
- [ ] Container images scanned
- [ ] Secrets rotated quarterly
- [ ] TLS certificates auto-renewed
- [ ] Firewall rules reviewed monthly

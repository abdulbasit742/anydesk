# Deployment QA Checklist

## Pre-Deployment
- [ ] All environment variables configured
- [ ] SSL certificates valid
- [ ] DNS records propagated
- [ ] Database migrations ready
- [ ] Backup strategy verified
- [ ] Monitoring configured
- [ ] Rollback plan documented

## Deployment
- [ ] Zero-downtime deployment
- [ ] Health checks pass
- [ ] Database migrations succeed
- [ ] WebRTC connectivity verified
- [ ] File transfer works
- [ ] Clipboard sync works
- [ ] Remote input works
- [ ] Audit logs recording

## Post-Deployment
- [ ] Smoke tests pass
- [ ] Error rate < 0.1%
- [ ] Response time p95 < 500ms
- [ ] WebSocket connections stable
- [ ] TURN relay functioning
- [ ] Backups completing
- [ ] Alerts routing correctly

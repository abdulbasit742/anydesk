# RemoteDesk On-Premises Deployment Guide

## For Air-Gapped Networks

## Prerequisites
- Kubernetes 1.28+ cluster
- Internal container registry
- Internal DNS
- Internal certificate authority

## Image Mirroring
```bash
# Pull from public registry, push to internal
docker pull remotedesk/api:latest
docker tag remotedesk/api:latest registry.internal/remotedesk/api:latest
docker push registry.internal/remotedesk/api:latest
# Repeat for web, db, redis, coturn images
```

## Helm Chart
```bash
helm repo add remotedesk https://charts.remotedesk.io
helm install remotedesk remotedesk/remotedesk \
  --set image.registry=registry.internal \
  --set persistence.storageClass=local-ssd \
  --values values-airgap.yaml
```

## Offline Considerations
- No external TURN: deploy internal Coturn
- No STUN: use host candidates only
- No CDN: serve static assets directly
- No telemetry: disable analytics
- No auto-update: manual update process

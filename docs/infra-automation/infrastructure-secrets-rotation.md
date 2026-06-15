# Infrastructure Secrets Rotation

## Rotation Schedule
| Secret | Rotation | Method |
|--------|----------|--------|
| DB password | Quarterly | Random 32-char |
| JWT secret | Quarterly | OpenSSL rand |
| TURN secret | Quarterly | Random 32-char |
| API keys | On demand | UUIDv4 |
| SSL certs | Auto (90 days) | certbot |

## Rotation Process
1. Generate new secret
2. Update in secret manager
3. Rolling restart of services
4. Verify functionality
5. Revoke old secret after 24h

## Commands
```bash
# Generate new secret
openssl rand -hex 32

# Update Kubernetes secret
kubectl create secret generic db-password \
  --from-literal=password=$(openssl rand -hex 32) \
  --dry-run=client -o yaml | kubectl apply -f -

# Rolling restart
kubectl rollout restart deployment/remotedesk-api
```

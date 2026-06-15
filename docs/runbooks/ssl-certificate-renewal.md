# SSL Certificate Renewal Runbook

## Check Expiry
```bash
echo | openssl s_client -servername remotedesk.io -connect remotedesk.io:443 2>/dev/null | openssl x509 -noout -dates
```

## Renewal (Let's Encrypt)
```bash
certbot renew --dry-run
certbot renew
systemctl reload nginx
```

## Verification
```bash
curl -vI https://remotedesk.io 2>&1 | grep expire
```

## Monitoring
- Alert 30 days before expiry
- Alert 7 days before expiry
- Alert 1 day before expiry

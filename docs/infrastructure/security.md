# Infrastructure Security

## Network
- Internal communication via Docker networks
- Only Nginx exposed externally
- TURN server on dedicated ports
- Database not exposed externally

## SSL/TLS
- TLS 1.2 minimum
- HTTP/2 enabled
- Certificate rotation support

## Secrets
- All secrets in `.env` file
- Never commit `.env`
- Rotate regularly

## Firewall
Recommended UFW rules:
```
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3478/tcp
ufw allow 3478/udp
ufw allow 49152:65535/udp
ufw enable
```

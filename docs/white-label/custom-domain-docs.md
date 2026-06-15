# RemoteDesk Custom Domain Setup

## Overview
Enterprise customers can use their own domain for RemoteDesk.

## Supported Domains
- app.yourcompany.com
- remotedesk.yourcompany.com
- Any subdomain you control

## Setup Steps

### 1. Choose Domain
Decide on subdomain (e.g., `remote.acme.com`)

### 2. DNS Configuration
Add CNAME record:
```
Type: CNAME
Name: remote
Value: custom.remotedesk.io
TTL: 300
```

### 3. SSL Certificate
Option A: RemoteDesk-managed (Let's Encrypt)
Option B: Upload your own certificate

### 4. Verify
```bash
dig remote.acme.com CNAME
# Should return: custom.remotedesk.io
```

### 5. Configure in Dashboard
- Admin Dashboard -> Settings -> Custom Domain
- Enter domain
- Verify ownership (DNS TXT record)
- Activate

## API Endpoint
Custom domain affects:
- Web app URL
- API base URL
- WebSocket URL
- Email links

## Example
```
Before: https://app.remotedesk.io
After:  https://remote.acme.com

API:    https://remote.acme.com/api/v1
WS:     wss://remote.acme.com/signaling
```

## Limitations
- Root domains not supported (must be subdomain)
- Wildcard certificates not supported
- DNS propagation may take up to 24 hours

## Security
- SSL required (HTTPS only)
- HSTS enabled
- Certificate auto-renewal
- No mixed content allowed

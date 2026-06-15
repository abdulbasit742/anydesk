# SSL and Nginx Configuration

## Nginx Config
```nginx
server {
    listen 443 ssl http2;
    server_name remotedesk.io;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Correlation-ID $request_id;
    }

    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
```

## SSL Certificate (Let's Encrypt)
```bash
certbot --nginx -d remotedesk.io -d www.remotedesk.io
```

## WebSocket Support
Ensure `proxy_set_header Upgrade` and `Connection` headers are set
for WebSocket proxying.

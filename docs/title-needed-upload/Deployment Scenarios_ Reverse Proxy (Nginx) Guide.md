# Deployment Scenarios: Reverse Proxy (Nginx) Guide

A reverse proxy like Nginx is a crucial component of a production RemoteDesk deployment. It sits in front of your application servers, handling incoming requests and routing them to the appropriate services. This document provides a guide for configuring Nginx as a reverse proxy for RemoteDesk.

## 1. Benefits of Using a Reverse Proxy

*   **SSL Termination:** Nginx handles HTTPS encryption, offloading this task from your application servers.
*   **Request Routing:** Route traffic to different services (API, Web, Signaling) based on domain name or path.
*   **Load Balancing:** Distribute traffic across multiple instances of your application services.
*   **Security:** Hide your internal application server structure and provide an additional layer of protection.
*   **Static Content Serving:** Nginx can efficiently serve static files (though less relevant for a Next.js app).
*   **WebSocket Support:** Nginx can be configured to proxy WebSocket connections for the signaling server.

## 2. Nginx Configuration Example

```nginx
# /etc/nginx/conf.d/remotedesk.conf

# 1. Web Application (yourdomain.com)
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Backend API (api.yourdomain.com)
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://api:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 3. Signaling Server (signaling.yourdomain.com)
server {
    listen 443 ssl http2;
    server_name signaling.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://signaling:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 4. Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com signaling.yourdomain.com;
    return 301 https://$host$request_uri;
}
```

## 3. Key Configuration Directives

*   **`proxy_pass`:** Specifies the address of the backend server to which requests should be proxied.
*   **`proxy_http_version 1.1`:** Required for WebSockets and some other modern protocols.
*   **`proxy_set_header Upgrade $http_upgrade` and `proxy_set_header Connection "upgrade"`:** Essential for enabling WebSocket proxying.
*   **`proxy_set_header Host $host`:** Passes the original `Host` header to the backend server.
*   **`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`:** Passes the client's original IP address to the backend server.

## 4. Security Hardening

*   **Use Strong SSL/TLS Settings:** Disable old and insecure protocols (like SSLv3, TLS 1.0, 1.1) and ciphers.
*   **Implement HSTS:** Use the `Strict-Transport-Security` header to force clients to use HTTPS.
*   **Rate Limiting:** Use Nginx's `limit_req` module to implement basic rate limiting at the proxy level.
*   **Request Size Limits:** Use `client_max_body_size` to limit the size of incoming request bodies.

## 5. Related Documents

*   `deployment-single-vps.md`
*   `deployment-docker-compose.md`
*   `deployment-ssl.md`
*   `deployment-qa.md`

# Deployment Scenarios: SSL/TLS Configuration Guide

Securing all communication in RemoteDesk with SSL/TLS is non-negotiable. This includes the web application, backend API, signaling server, and media traffic. This document provides a guide for configuring SSL/TLS in your RemoteDesk deployment.

## 1. Why SSL/TLS is Mandatory

*   **Data Privacy:** Encrypts all data transmitted between the client and the server, protecting it from eavesdropping.
*   **Data Integrity:** Ensures that data is not tampered with during transmission.
*   **Authentication:** Verifies the identity of the server to the client.
*   **WebRTC Requirements:** Most modern browsers require a secure origin (HTTPS) to access media devices and establish WebRTC connections.
*   **WebSocket Security:** Secure WebSockets (WSS) are required when the page is served over HTTPS.

## 2. Obtaining SSL Certificates

### 2.1. Let's Encrypt (Recommended)

Let's Encrypt is a free, automated, and open certificate authority.

*   **Tools:** Use `Certbot` to automatically obtain and renew certificates.
*   **Methods:** HTTP-01 challenge (requires port 80 to be open) or DNS-01 challenge (requires access to your DNS provider's API).
*   **Implementation:** See `deployment-single-vps.md` for an example with Nginx.

### 2.2. Commercial Certificate Authorities

For organizations requiring higher levels of validation (e.g., OV or EV certificates) or specialized support.

### 2.3. Cloud Provider Managed Certificates

If using cloud-managed load balancers (e.g., AWS ALB, Google Cloud Load Balancing), you can often use their managed certificate services (e.g., AWS Certificate Manager).

## 3. Configuration Best Practices

### 3.1. SSL Termination at the Reverse Proxy

The most common and recommended approach is to terminate SSL at your reverse proxy (e.g., Nginx, HAProxy) or load balancer. This simplifies management and offloads the encryption/decryption task from your application servers.

### 3.2. Use Strong Protocols and Ciphers

*   **Protocols:** Enable only TLS 1.2 and TLS 1.3. Disable SSLv2, SSLv3, TLS 1.0, and TLS 1.1.
*   **Ciphers:** Use a modern and secure set of cipher suites (e.g., those recommended by Mozilla's SSL Configuration Generator).

### 3.3. Implement HSTS (HTTP Strict Transport Security)

Use the `Strict-Transport-Security` header to tell browsers to only interact with your domain using HTTPS.

`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`

### 3.4. Secure WebSockets (WSS)

Ensure your signaling server is accessed via `wss://` and that your reverse proxy is correctly configured to handle the WebSocket upgrade over HTTPS.

### 3.5. TURN over TLS

For maximum compatibility and security, configure your TURN server to support TLS (usually on port 5349).

## 4. Monitoring and Renewal

*   **Automated Renewal:** Ensure your certificate renewal process is automated (e.g., via a cron job for Certbot).
*   **Monitoring:** Set up alerts to notify you if a certificate is nearing its expiration date and has not been renewed.
*   **Testing:** Regularly test your SSL configuration using tools like [SSL Labs' Server Test](https://www.ssllabs.com/ssltest/).

## 5. Related Documents

*   `deployment-single-vps.md`
*   `deployment-reverse-proxy.md`
*   `deployment-coturn.md`
*   `deployment-qa.md`

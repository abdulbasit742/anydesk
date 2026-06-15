# Webhook delivery

Webhook deliveries should be signed, retried with backoff, capped by max attempts and visible in admin UI.
Failed deliveries should not block core RemoteDesk session traffic.

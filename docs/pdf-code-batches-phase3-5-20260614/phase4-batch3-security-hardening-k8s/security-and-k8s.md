  # Security & Kubernetes


  ## Config
  - All secrets validated at boot via `loadConfig()` (Zod). Missing/short secrets → process refuses to start.
  - `NODE_ENV=test` injects safe defaults so tests need no real secrets.


  ## HTTP security
  - Security headers on every response (nosniff, DENY framing, HSTS, Permissions-Policy locking capture to self).
  - CORS allow-list from `CORS_ORIGINS` (comma-separated).
  - Rate limits: 300 req/min general, 10 req/min on `/api/auth/*` keyed by ip+email to blunt credential stuffing. Standard

  `RateLimit-*` headers + `Retry-After` on 429.


  ## Kubernetes
  ```bash
  kubectl apply -f deploy/k8s/namespace.yaml
  kubectl apply -f deploy/k8s/api-secret.example.yaml   # edit secrets first!
  kubectl apply -f deploy/k8s/


• Liveness → /healthz, readiness → /readyz (from Phase 4 Batch 2).
• HPA scales api 2→10 on 70% CPU. Ingress terminates TLS via cert-manager and long read-timeout for
  websocket signaling.

  ---


  **Phase 4, Batch 3 done: 18 files** — env schema + validated config loader (fail-fast on bad secrets), security headers,
  CORS allow-list, sliding-window HTTP rate limiter + a tight auth limiter, app.ts wired with the full security stack, 8
  k8s manifests (namespace, secret example, api/web deploys + services, ingress with TLS, HPA), 3 tests, and a security/k8s
  doc.


  **What's hardened:** the server now refuses to boot with weak/missing secrets, every response carries security headers,
  auth endpoints resist credential stuffing, and you've got production k8s manifests wired to the health probes with
  autoscaling + TLS ingress.


  This pretty much rounds out productionization. Next number = Phase 4 Batch 4 (persistence layer: swap in-memory repos for
  Postgres + Prisma, with migrations), or say the word and I'll draw up a fresh manifest for whatever you want next.

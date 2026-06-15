  # Observability & Deploy


  ## Logging
  - Structured JSON to stdout (one line per event). Ship with any log collector.
  - `LOG_LEVEL` controls verbosity (debug|info|warn|error).
  - Every request is logged with method, path, status, durationMs, and an x-request-id (echoed in responses for
  correlation).

  ## Errors
  - `errorHandler` is the single exit point: Zod → 400 VALIDATION_FAILED, AppError → mapped status, anything else → 500
  + captured.
  - `installProcessHandlers()` catches unhandledRejection/uncaughtException.
  - Swap `errorTracker` for Sentry by implementing the `ErrorSink` interface.


  ## Probes
  - `GET /healthz` — liveness (always ok if process is up).
  - `GET /readyz` — readiness (503 until the server has bound and marked ready; flips to not-ready on shutdown).
  - Wire these to k8s livenessProbe/readinessProbe or the Docker HEALTHCHECK.


  ## Deploy
  ```bash
  export JWT_SECRET=... RECONNECT_TOKEN_SECRET=... TURN_STATIC_SECRET=... TURN_HOST=turn:your-host:3478
  docker compose up --build -d
  # web on :8080 (proxies /api → api:4000), api on :4000, coturn on host net

  ---


  **Phase 4, Batch 2 done: 18 files** — structured logger, request-id + request-logger middleware, error tracker + process
  handlers, the single error-handler middleware (Zod→400, AppError→mapped status), health/readiness probes + route, real
  `app.ts`/`server.ts` with graceful shutdown, test server repointed to the prod app, Dockerfiles for api + web, nginx
  SPA+proxy config, docker-compose tying in coturn, .dockerignore, 3 tests, and an observability doc.


  **What this gives you:** correlated request logs, a clean error contract with proper status codes, k8s/Docker-ready
  probes, and a one-command `docker compose up` that stands up api + web + TURN. The test server now runs the exact prod

app, so tests catch middleware regressions too.


Next number = Phase 4 Batch 3 (rate-limiting hardening + security headers + secrets/config validation + k8s manifests).
Bolo.

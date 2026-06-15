  # Persistence (Postgres + Prisma)

  ## What changed
  - In-memory Maps replaced with Postgres tables. Repository **interfaces are unchanged** (now return Promises), so
  services just `await`.
  - Prisma schema in `apps/api/prisma/schema.prisma`; SQL migration in `prisma/migrations/0001_init`.


  ## Local setup
  ```bash
  export DATABASE_URL=postgresql://remotedesk:dev@localhost:5432/remotedesk
  pnpm --filter @remotedesk/api exec prisma migrate dev
  pnpm --filter @remotedesk/api dev

Notes
• connectDb() runs before the server marks ready, so /readyz only passes once the DB is reachable.
• Recording events are stored as JSONB; for very long sessions, consider a child RecordingEvent table later.
• Heartbeat sweep should move to a scheduled job (or SQL WHERE lastSeenAt < now() - interval ).
  ---


  **Phase 4, Batch 4 done: 17 files** — Prisma schema (6 models) + init SQL migration, Prisma client + connect/disconnect,
  env schema now requires DATABASE_URL, four repositories rewritten onto Postgres (same interfaces, now async), services +
  auth route updated to await, server connects DB before readiness, docker-compose gains a healthchecked Postgres, a DB
  test-reset helper + integration test, CI gets a Postgres service, and a persistence doc.


  **The big graduation:** nothing lives in memory anymore. Data survives restarts, scales across the 2+ api replicas from
  the k8s batch, and `/readyz` correctly gates on DB connectivity. Because the repository interfaces held steady, services
  and routes barely changed, exactly why that layering was worth it.


  That's a genuinely production-shaped stack now, Abdul: capture → WebRTC → signaling → auth → persistence →
  observability → CI/CD → k8s. Next number = Phase 5 Batch 1 (real-time presence + a Postgres-backed signaling server
  with Redis pub/sub for multi-replica fan-out), or tell me where you want to point this.

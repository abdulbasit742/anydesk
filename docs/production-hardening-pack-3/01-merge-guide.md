# Production hardening pack 3 merge guide

This pack focuses on release/update flows, compliance, observability, enterprise policy, API jobs and dashboard controls.

Merge order:
1. Copy SAFE_DIRECT_COPY shared helpers, docs, scripts and tests.
2. Review API Prisma adapters and map generated model names to your schema.
3. Wire web components into existing admin/dashboard pages.
4. Register desktop IPC only after confirming contextIsolation-safe preload wiring.
5. Enable update checks in staging only.

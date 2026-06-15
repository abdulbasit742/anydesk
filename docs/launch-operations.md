# RemoteDesk Launch Operations

RemoteDesk now has a Prisma-backed launch operations surface for tracking the real production gates that still block release.

## API endpoints

All routes require a bearer token.

- `GET /api/launch/readiness`
  - Seeds default launch checks for the first authenticated operator.
  - Returns launch check counts, blocker state, release candidates, migration gates, rollout approvals, and open support escalations.
- `PATCH /api/launch/checks/:key`
  - Updates a launch check status, requirement flag, label, area, or notes.
- `POST /api/launch/release-candidates`
  - Creates a release candidate and marks it `promotable` only when the desktop build is signed, migrations are reviewed, and smoke tests pass.
- `PATCH /api/launch/release-candidates/:id`
  - Updates release candidate gates and promotion status.
- `POST /api/launch/rollout-approvals`
  - Records an approval request or decision for security, desktop, billing, infra, or support.
- `PATCH /api/launch/rollout-approvals/:id`
  - Updates an approval decision.
- `POST /api/launch/migration-checks`
  - Records a migration review and classifies risk using the shared Pack 9 helper.
- `PATCH /api/launch/migration-checks/:id`
  - Updates a migration gate and recomputes risk.
- `POST /api/launch/support-escalations`
  - Creates an escalation and routes it to tier 2, engineering, security, or billing.
- `PATCH /api/launch/support-escalations/:id`
  - Updates status, assignment, or details.

## Dashboard

The web dashboard now includes `/dashboard/launch`.

The page shows:

- blocked vs ready launch state
- pass/warn/fail/not applicable counts
- editable launch checks
- release candidate creation
- recent release candidate list
- migration gate list
- support escalation creation and open escalation list

## Launch defaults

The seeded launch checks intentionally keep the project blocked until real production gates pass:

- API health endpoints
- signed desktop build
- two-client remote desktop smoke test
- billing provider production key verification
- safe device command queue QA
- support escalation persistence

## Safety

This does not mark RemoteDesk production-ready by itself. It makes readiness visible and auditable. Desktop signing, real billing, native input safety, end-to-end QA, and deploy verification remain explicit blockers.

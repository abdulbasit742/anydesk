# RemoteDesk Pack 7/8 Code Review

## Pack 7 - Customer Success and Reliability

Safe helper domains imported:

- customer health scoring
- fleet group policy
- localization labels
- accessibility labels
- support automation recommendations
- release-channel access checks
- offline queue policy
- safe device command envelopes

Runtime modules stayed review-only because they introduce a large parallel `pack7` API/web/desktop tree that is not wired to the current Prisma schema, current Next.js app routes, or current Electron renderer structure.

Manual port completed:

- `safeDeviceCommand` now backs a small safe-maintenance command panel on the existing device detail page.
- The API explicitly blocks dangerous command classes rather than exposing generated command execution primitives.

## Pack 8 - Governance and Automation

Safe helper domains imported:

- evidence control due checks
- procurement state transitions
- email template safety inspection
- backup restore scoring
- legal-hold activity checks
- admin approval resolution
- webhook retry schedule
- data classification helpers

Runtime modules stayed review-only because governance APIs need real persistence, server-side authorization, object storage for evidence artifacts, a mail provider, and legal-hold enforcement inside deletion jobs.

## 200-File PDF Handoff

The PDF was extracted to text under `_incoming/rd-batch-plan-200-pdf/`. It is useful as a checklist, but it is not authoritative for the current repo state. Its gap report says desktop incoming requests, screen capture, WebRTC flow, remote session UI, and remote input are missing, while this repo already has partial implementations of those areas.

## Risk Notes

- Generated Pack 7/8 tests were not imported because several "safe" tests import `REVIEW_REQUIRED` runtime files.
- Pack 7 device command work must stay envelope-only until a persistent command queue, device polling, audit logging, expiry enforcement, and host confirmation exist.
- Pack 8 legal hold and evidence workflows must not be represented as complete until real deletion jobs, storage, and authorization checks are wired.

## Recommended Next Port

Add a Prisma-backed device command queue:

- `DeviceCommand`
- command expiry and status fields
- API create/list/ack routes
- desktop polling for safe command types only
- audit log entries for command issue, delivery, completion, and expiry

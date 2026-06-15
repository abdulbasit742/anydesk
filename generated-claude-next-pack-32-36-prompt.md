# Claude Prompt: RemoteDesk Packs 32-36 Real Code Sprint

You are continuing an existing project called **RemoteDesk**, an AnyDesk-style full-stack SaaS remote desktop app.

The repository already has:

- `apps/api` Express + Prisma API
- `apps/web` Next.js dashboard
- `apps/desktop` Electron desktop client
- `packages/shared` shared TypeScript contracts/helpers
- Device trust/access policy persistence
- Device audit events
- Safe device command queue
- Desktop policy enforcement
- WebRTC capture/session flow
- File transfer and clipboard helper foundations
- Connector catalog
- Launch readiness foundations

Important current build estimate: **62-68%**.

## Hard Rules

Do not generate filler files.
Do not create numbered placeholder files.
Do not rewrite the whole project.
Do not replace existing app architecture.
Do not invent a parallel API/auth/session/device model.
Prefer small production files that can be merged safely.
Every file must be useful and connected to a real production feature.

Use these existing paths and contracts when possible:

- `apps/api/src/routes/device.routes.ts`
- `apps/api/src/lib/deviceSecurity.ts`
- `apps/api/src/lib/deviceCommands.ts`
- `apps/api/src/lib/deviceAdminAudit.ts`
- `apps/api/prisma/schema.prisma`
- `apps/web/app/dashboard/devices/[deviceId]/page.tsx` or the existing device detail route path
- `apps/desktop/src/main`
- `apps/desktop/src/preload`
- `apps/desktop/src/renderer/src`
- `packages/shared/src/permissions`
- `packages/shared/src/session`
- `packages/shared/src/security`

## Goal

Produce **real code** for Packs 32-36. Focus on the remaining highest-value production blockers after device-admin audit history:

1. Web device audit UI using the new API endpoint.
2. Receipt schema foundation without real signing yet.
3. Desktop disconnect consent receipt draft generation.
4. Server-side receipt verification skeleton.
5. Recording consent and recording-readiness UI without unsafe auto-recording.

## Pack 32: Web Device Audit UI

Build a production device-admin audit tab/panel in the web dashboard.

Requirements:

- Add or update the device detail page to call `GET /api/devices/:deviceId/audit?limit=50`.
- Show audit rows with:
  - action label
  - message
  - actor name/email if present
  - timestamp
  - safe metadata summary
- Add loading, empty, and error states.
- Add a "Refresh audit" action.
- Do not show secrets or raw JSON dumps by default.
- Keep the UI compatible with the existing dashboard shell.

Expected files:

- A small API client/helper if the current web app has one.
- A reusable `DeviceAuditTimeline` component.
- Minimal device detail integration.
- Optional unit/helper tests for metadata formatting.

## Pack 33: Receipt Data Model Foundation

Add a receipt persistence foundation in the API without implementing full signing yet.

Requirements:

- Add Prisma models/migration for consent/session receipts:
  - `ConsentReceipt`
  - optional `ConsentReceiptEvent`
- Fields should support:
  - session id
  - host device id
  - viewer user id
  - host user id
  - accepted permissions snapshot
  - started/ended timestamps
  - disconnect reason
  - signature status: `unsigned`, `signed`, `verification_failed`
  - hash fields reserved for later Ed25519 signing
- Add safe API routes:
  - `POST /api/receipts/draft`
  - `GET /api/receipts/:receiptId`
  - `GET /api/devices/:deviceId/receipts`
- Add ownership checks. Device owner can see device receipts; viewer can see their own receipts.
- Do not add real private keys yet.

Expected files:

- Prisma schema update
- migration SQL
- API route module
- service/helper module
- shared receipt contract in `packages/shared`
- tests for receipt shape/validation helpers if easy

## Pack 34: Desktop Disconnect Receipt Draft

Build desktop-side receipt draft creation on disconnect.

Requirements:

- When a desktop session disconnects, collect:
  - session id
  - role
  - peer id/name
  - started at
  - ended at
  - enabled permissions
  - disconnect reason
- Call the API `POST /api/receipts/draft` if auth token/API client exists.
- If offline/API call fails, queue the receipt draft locally for retry.
- Add a small receipt summary UI shown after disconnect.
- Never block the user from disconnecting.
- Do not record screen content.

Expected files:

- desktop receipt draft service
- offline queue helper
- renderer receipt summary component
- IPC/preload types if needed
- small shared DTOs

## Pack 35: Server Verification Skeleton

Add receipt verification skeleton that can later be upgraded to Ed25519.

Requirements:

- Add deterministic canonical JSON helper in `packages/shared`.
- Add receipt digest/hash helper using Web Crypto if available or Node crypto on API side.
- Add API endpoint:
  - `POST /api/receipts/:receiptId/verify`
- Verification should currently validate:
  - receipt exists
  - required fields present
  - stored hash matches canonical payload if hash exists
  - signature status is not falsely marked signed without signature metadata
- Return structured verification result:
  - valid boolean
  - checks array
  - failed check ids
- Do not claim cryptographic non-repudiation until Ed25519 keys are real.

Expected files:

- shared canonical JSON/digest helpers
- API verification service
- API verification route
- tests for canonical JSON stability

## Pack 36: Recording Consent and Readiness UI

Build the safe foundation for encrypted recording without actual storage upload yet.

Requirements:

- Add shared recording policy types:
  - recording allowed/blocked
  - consent required
  - retention days
  - encryption required
- Add web policy UI placeholder for recording settings if the dashboard has policy pages.
- Add desktop session UI:
  - recording disabled by default
  - host-visible recording consent prompt
  - viewer-visible recording status
  - no recording starts until both policy and host consent allow it
- Add API route skeleton to read recording policy for a device/team if compatible.
- Do not implement screen recording storage unless all consent/policy checks are in place.

Expected files:

- shared recording policy contract
- API recording policy service/route skeleton
- web recording policy card/page section
- desktop recording consent UI/state
- tests for policy evaluation helper

## Output Format

Return a full file manifest grouped by:

- SAFE_DIRECT_COPY
- REVIEW_REQUIRED
- DO_NOT_MERGE

For every file, include:

- path
- purpose
- dependencies
- whether it modifies existing behavior

Also include exact code blocks for each file.

End with:

- migration commands
- test commands
- manual QA checklist
- remaining blockers after Packs 32-36

Remember: production progress beats file count. If you cannot safely produce many files, produce fewer real files.

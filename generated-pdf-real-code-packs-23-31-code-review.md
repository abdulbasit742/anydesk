# RemoteDesk PDF Real-Code Packs 23-31 Code Review

Build estimate after current adapted merge: **62-68%**.

## Pack 25 Adapted

Pack 25 is compatible with the current app because RemoteDesk already has:

- `DeviceAuditEvent` Prisma model
- `writeDeviceAuditEvent()`
- device trust/access-policy mutation routes
- device detail timeline

Instead of adding a parallel `AuditLog` module, the pack was adapted into existing device audit events.

## Files Ported

- Shared device-admin audit contract: `packages/shared/src/permissions/deviceAdminAudit.ts`
- Shared barrel export: `packages/shared/src/permissions/index.ts`
- API audit listing/serializer helper: `apps/api/src/lib/deviceAdminAudit.ts`
- Trust/policy before-after audit writes: `apps/api/src/lib/deviceSecurity.ts`
- Device audit endpoint and richer device timeline events: `apps/api/src/routes/device.routes.ts`
- Contract test: `tests/permissions/deviceAdminAudit.test.ts`

## Packs Kept Review-Only

### Pack 23

Good ideas: trust/unattended grants admin page, consent receipt admin controls.

Why skipped: the current repo needs one unified trust grant schema before adding web admin mutation flows. Direct import could create duplicate grant concepts.

### Pack 24

Good ideas: admin RBAC around trust/grant mutations, server-side receipt verification.

Why skipped: role scope needs to align with the current auth model and existing device ownership checks first.

### Pack 26

Good ideas: Ed25519 receipt signing and non-repudiation.

Why skipped: requires signing key storage, migration, key activation windows, and a verifiable receipt schema.

### Pack 27

Good ideas: KMS envelope encryption and key rotation.

Why skipped: provider decision is still open; direct code would bake in assumptions before deployment target is known.

### Pack 28

Good ideas: desktop-side receipt verification and public-key pinning.

Why skipped: depends on signed server receipts and public-key publishing from Packs 26-27.

### Pack 29

Good ideas: public receipt verification portal.

Why skipped: should be built after receipt signature creation and server verification are real.

### Pack 30

Good ideas: scheduled rotation with overlap windows.

Why skipped: should follow the KMS/key metadata implementation.

### Pack 31

Good ideas: encrypted session recording and playback.

Why skipped: high-risk feature requiring explicit consent, encryption, storage bucket, retention policy, and playback authorization. Needs a separate implementation pass.

## Next Safe Runtime Steps

1. Add device-admin audit UI to the web device detail page using `GET /api/devices/:deviceId/audit`.
2. Add receipt schema + unsigned draft receipt record before Ed25519 signing.
3. Add key metadata tables with inactive/test-only keys before real signing.
4. Add desktop-side disconnect receipt preview before server verification.
5. Add recording consent UI before any capture/storage implementation.

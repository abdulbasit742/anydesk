# RemoteDesk Device Trust and Access Policy

RemoteDesk now stores explicit trust and access policy state for each registered desktop device.

## Database records

Each device has two persisted security records:

- `DeviceTrust`
  - `trusted`, `untrusted`, or `blocked`
  - trust/revoke timestamps
  - operator reason
- `DeviceAccessPolicy`
  - unattended access toggle
  - remote input toggle
  - clipboard sync toggle
  - file transfer toggle
  - session approval requirement
  - maximum session length

## API endpoints

All routes require authentication and only work for devices owned by the caller.

- `PATCH /api/devices/:deviceId/trust`
  - body: `{ "status": "trusted" | "untrusted" | "blocked", "reason"?: string }`
  - blocking a device automatically disables access features.
- `PATCH /api/devices/:deviceId/access-policy`
  - body can include any saved policy field.
  - unattended access cannot be enabled until the device is trusted.
  - blocked devices cannot enable access features.

## Dashboard behavior

The device detail page now exposes:

- Trust / Untrust / Block controls
- Unattended access toggle
- Remote input policy toggle
- Clipboard sync policy toggle
- File transfer policy toggle
- Require session approval toggle

Every change writes a `DeviceAuditEvent`, so the existing device timeline becomes the operator-facing audit trail.

## Safety rules

- New devices start as `untrusted`.
- Unattended access requires explicit device trust.
- Blocking a device disables unattended access, remote input, clipboard sync, and file transfer.
- These records are policy gates only. Native input execution remains disabled until the dedicated executor is implemented and verified.

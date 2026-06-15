# Device Command Queue

Build status after this work: **44-51%**.

RemoteDesk now has a first production-safe device command queue. It is intentionally limited to safe maintenance commands and does not expose shell execution, native input execution, or unattended access.

## Supported Commands

- `refresh_policy`
- `collect_diagnostics`
- `check_update`
- `sign_out`

Blocked command classes:

- `remote_shell`
- `run_command`
- `execute_native_input`
- `unattended_access`

## API Flow

1. Desktop client registers itself with `POST /api/devices/register`.
2. Desktop client heartbeats with `PATCH /api/devices/:deviceId/heartbeat`.
3. Dashboard queues a safe command with `POST /api/devices/:deviceId/commands`.
4. Desktop polls `GET /api/devices/:deviceId/commands/pending`.
5. Desktop acknowledges lifecycle changes with `PATCH /api/devices/:deviceId/commands/:commandId`.

## Persistence

The API stores command state in `DeviceCommand` and lifecycle audit records in `DeviceAuditEvent`.

Command statuses:

- `pending`
- `delivered`
- `completed`
- `failed`
- `expired`
- `canceled`

## Remaining Work

- Run Prisma migration and generate client.
- Add desktop UI for command-polling status.
- Add admin/owner role checks when teams are introduced locally.
- Add retry/backoff for command polling.
- Add E2E test with web queueing and desktop acknowledgement.

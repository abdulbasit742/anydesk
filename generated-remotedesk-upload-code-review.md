# RemoteDesk Upload Code Review

Source: `_incoming/remotedesk-upload/`

## Ported Now

- Data-channel envelope parsing/serialization was adapted into `packages/shared/src/dataChannel/envelope.ts`.
- Data-channel backpressure and latency helpers were adapted into `packages/shared/src/dataChannel/`.
- File-transfer ID, chunk checksum, total chunk, and display formatting helpers were adapted into `packages/shared/src/fileTransfer/`.

These are pure helpers and do not mutate existing app runtime behavior.

## Review-Only Runtime Areas

- `apps/desktop/src/main/ipc/fileTransferIpc.ts` has useful file picker/read/write concepts, but it imports generated shared symbols that do not match the current shared `FileMetadata` shape. It should be manually ported after the current data-channel file-transfer protocol is wired.
- `apps/desktop/src/main/ipc/clipboardIpc.ts` has a good clipboard poll/write shape, but depends on generated clipboard payload helpers not currently present in runtime. Port after permission-gated clipboard sync is designed.
- `apps/desktop/src/main/inputExecutors/*` and `apps/desktop/src/main/ipc/inputExecutorIpc.ts` remain stubs. Keep real OS input disabled until permissions, audit logging, emergency stop, and platform-specific execution are verified.
- `apps/api/src/modules/audit/*` contains useful event factory ideas, but `auditModel.ts` is stubbed and needs a Prisma schema/migration before use.
- `apps/web/src/features/*` pages are standalone generated UI slices and are not wired into the current Next app routing or API client.

## Best Next Ports

1. Add a desktop file-transfer UI that uses current `SessionDataChannel` plus the new shared chunk helpers.
2. Add Electron main/preload file picker and safe save IPC with the current shared `FileMetadata` shape.
3. Add clipboard read/write IPC and permission-gated sync over `SessionDataChannel`.
4. Add API audit schema and event recording after the Prisma model is explicitly migrated.

## Risks Found

- Several incoming files are marked `SAFE_DIRECT_COPY`, but they are safe only inside their generated project shape. Some conflict with current RemoteDesk contracts.
- Some generated files contain mojibake in comments. Runtime code kept in this repo stays ASCII.
- Native input execution remains deliberately disabled; this is still a production blocker.

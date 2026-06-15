# RemoteDesk Sprint Pack Part 1 Risk Register

| Risk | Area | Severity | Mitigation |
|---|---|---:|---|
| Existing shared exports conflict with new barrels | packages/shared | High | Manually merge `index.ts` and sub-barrels; do not blindly overwrite. |
| Socket event names differ from current server/client | socket | High | Review against current Socket.IO implementation before copying. |
| Plan limits are product assumptions | billing | Medium | Treat defaults as configurable; confirm pricing before enforcement. |
| File extension block list is incomplete | file transfer | Medium | Expand with security review and admin policy config. |
| Clipboard HTML sanitizer is minimal | clipboard | Medium | Keep HTML disabled by default; use stronger sanitizer if HTML sync ships. |
| TypeScript tests may need runner config | tests | Medium | Use existing repo test tooling or run through tsx/ts-node/vitest as appropriate. |
| WebRTC stats shape varies across browsers | diagnostics | Medium | Mapper accepts minimal fields, but desktop integration must test Electron platforms. |

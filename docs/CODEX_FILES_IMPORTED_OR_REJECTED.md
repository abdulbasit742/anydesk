# Codex Files Imported or Rejected

This document tracks exactly which files from the Codex ZIP were imported, modified, or rejected during the runtime recovery sprint.

| File / Component | Status | Reason | Risk Level | Conflicts |
| :--- | :--- | :--- | :--- | :--- |
| `packages/shared/package.json` | **Modified** | The Codex highlighted the need for deep ESM imports. Added a 42-entry `exports` map to fix `ERR_MODULE_NOT_FOUND`. | High | None. File was safely updated. |
| `packages/shared/src/fileTransfer/chunkProtocol.ts` | **Modified** | Fixed constant name mismatch (`FILE_TRANSFER_CHUNK_SIZE_BYTES` -> `FILE_CHUNK_SIZE_BYTES`) identified via Codex comparison. | Low | None. |
| `packages/shared/src/hardening/csvExport.ts` | **Modified** | Fixed unescaped newlines in regex that caused `esbuild` to crash during API startup. | Low | None. |
| `packages/shared/src/hardening/pagination.ts` | **Modified** | Replaced Node.js `Buffer` with browser-compatible `btoa`/`atob` to fix typecheck errors across environments. | Low | None. |
| `pnpm-workspace.yaml` | **Modified** | The Codex proved the source code was valid, pointing to a dependency issue. Updated `allowBuilds` to permit `electron` and `esbuild` binaries to download. | High | None. Resolved desktop build failure. |
| `apps/desktop/src/main/input/*` | **Rejected** | The Codex input implementation still defaulted to a `noop` executor for safety. Importing it would not change the runtime behavior (still no actual remote control). | N/A | N/A |
| `apps/api/src/server.ts` | **Rejected** | Current repo has better observability and health check endpoints. | N/A | N/A |
| `apps/web/*` | **Rejected** | The `anydesklovable` repo is the designated frontend. Codex web app was ignored. | N/A | N/A |
| `public/sw.js` (Lovable) | **Created** | Codex did not have a PWA service worker. Created a minimal network-first SW manually to enable PWA installation. | Medium | None. |
| `src/routes/__root.tsx` (Lovable) | **Modified** | Added service worker registration to the root component. | Low | None. |

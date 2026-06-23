# Prompt #26: Critical Blockers — Safe Fixes Applied

**Date:** 2026-06-23
**Repository:** AnyDesk (Backend & Desktop Client)

## Fixes Applied (Safe, Non-Breaking)

The following fixes were applied to resolve typecheck failures in the `packages/shared` library. These are the only safe fixes that do not change runtime behavior or introduce new dependencies.

### Fix 1: `packages/shared/src/hardening/csvExport.ts`

**Problem:** The file contained a multi-line regex literal that was split across physical lines, causing the TypeScript parser to fail with "Unterminated regular expression literal."

**Fix:** Rewrote the regex as a single-line pattern `/[",\n\r]/` and restructured the file to be syntactically valid.

**Impact:** Shared package now compiles without this error. No runtime behavior change.

### Fix 2: `packages/shared/src/fileTransfer/chunkProtocol.ts`

**Problem:** The file imported `FILE_TRANSFER_CHUNK_SIZE_BYTES` from `./constants.js`, but the actual export name is `FILE_CHUNK_SIZE_BYTES`.

**Fix:** Changed the import to use the correct name `FILE_CHUNK_SIZE_BYTES`.

**Impact:** Shared package now compiles without this error. No runtime behavior change.

### Fix 3: `packages/shared/src/hardening/pagination.ts`

**Problem:** The file used `Buffer.from()` and `Buffer.toString()`, but the shared package's `tsconfig.json` does not include Node.js type definitions (`@types/node`). The shared package is intended to be isomorphic (browser + server).

**Fix:** Replaced `Buffer` usage with browser-compatible `btoa`/`atob` combined with `encodeURIComponent`/`decodeURIComponent` for UTF-8 safety.

**Impact:** Shared package now compiles without this error. Cursor encoding/decoding behavior is preserved.

## Fixes NOT Applied (Unsafe or Require Architectural Decisions)

| Blocker | Why Not Fixed |
| :--- | :--- |
| API server crash (`ERR_MODULE_NOT_FOUND` for deep `@remotedesk/shared/pack*` imports) | Requires adding an `exports` map to `packages/shared/package.json` which would change the module resolution contract for all consumers. This is an architectural decision. |
| Desktop build failure (missing Electron binary) | Requires `pnpm approve-builds electron` and downloading ~80MB of platform-specific binaries. This is an environment setup issue, not a code fix. |
| API typecheck errors (23 errors in `apps/api`) | These are pre-existing type errors in route handlers (implicit `any`, missing Prisma types). Fixing them requires understanding the intended types and may change runtime behavior. |
| Desktop typecheck errors (26 errors in `apps/desktop`) | Pre-existing errors requiring Electron type definitions and architectural decisions about renderer/main process boundaries. |
| Dashboard lint errors (26,488 errors in `anydesklovable`) | These are overwhelmingly formatting/style issues from the Lovable code generator. Fixing them would touch every file and is not a "safe" fix. |

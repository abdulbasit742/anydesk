# RemoteDesk Next 1000 Production Sprint Code Review

## Findings

### Runtime overlap in desktop
The generated desktop runtime pack contains file transfer, clipboard, settings, diagnostics, and session shell files that overlap with current live files. The current repo already has active RemoteSessionView, FileTransferPanel, ClipboardSyncPanel, webrtcStats.ts, diagnostics, and settings modules. Direct overwrite would risk regressing the working WebRTC/capture/data-channel path.

### API architecture mismatch
Generated API modules assume a src/modules/* architecture and add audit/support/security/team services before the current Prisma schema has matching tables. Current API is still a simpler Express routes/middleware/socket layout. These files should be ported only after schema migrations are added.

### Web dashboard mismatch
Generated web dashboard files target a separate feature-folder UI layer. The user has also been using Lovable/Supabase for the web dashboard, so local pps/web generated files should remain review-only until the desired source of truth is confirmed.

### Generated tests are not immediately runnable
The tests under SAFE_DIRECT_COPY/tests/** import files from staged REVIEW_REQUIRED/** paths. They are useful as behavior specs, but wiring them into the repo now would fail.

### Minor source quality issue
At least one generated diagnostics component contains mojibake text for an em dash. This confirms review-only treatment is correct for runtime UI files.

## Useful Ideas To Port Later

- webrtcStatsSampler.ts: stats sampling idea is useful, but current pps/desktop/src/renderer/src/services/webrtcStats.ts is stronger and already integrated.
- SessionIntegrationHost.tsx: panelized session shell is useful, but should wrap existing RemoteSessionView carefully rather than replace it.
- ateLimitPolicy.ts and olePermissionPolicy.ts: pure helpers are useful, but the shared package already has team/billing/security contracts. API wiring should happen when route/schema work starts.
- Diagnostics support bundle docs and schema are useful and were imported as shared contracts/docs.

## Recommended Next Merge

Implement diagnostics support bundle runtime using the newly imported shared desktop contract:

- add an export button to the session tools area,
- collect current WebRTC stats from webrtcStats.ts,
- redact sensitive fields,
- save JSON via existing Electron-safe IPC or a small new diagnostics IPC.

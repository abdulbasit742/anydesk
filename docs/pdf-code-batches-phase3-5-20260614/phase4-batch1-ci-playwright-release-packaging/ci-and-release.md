  # CI & Release


  ## Pipelines

   - **ci.yml** — install → build shared → typecheck → lint → unit + e2e tests → build. Runs on every push/PR.
   - **playwright.yml** — installs Chromium, builds api, runs browser e2e, uploads the report on failure.
   - **release.yml** — on a `v*` tag, packages the desktop app for macOS/Windows/Linux and uploads artifacts.


   ## Cutting a release
   ```bash
   npm version minor      # or major/patch — creates the vX.Y.Z tag
   git push --follow-tags # triggers release.yml across all 3 OSes


Local packaging
   pnpm --filter @remotedesk/desktop package
   # outputs to apps/desktop/release/


macOS notes
Screen capture requires the entitlements in build/entitlements.mac.plist and a
user-granted Screen Recording permission. Notarization needs Apple credentials set
as CI secrets (APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID).
   ---


   **Phase 4, Batch 1 done: 17 files** — 3 GitHub Actions workflows (CI, Playwright, release), Playwright config + fixtures
   + 3 browser specs, electron-builder config + mac entitlements, the real Electron main + preload (wiring the
   desktopCapturer bridge the capture module expected back in Phase 1), updated desktop + root package.json scripts, and a
   CI/release doc.


   **What this locks in:** every PR now builds, typechecks, lints, and runs unit + e2e + browser tests. Tagging `vX.Y.Z`
   produces installable desktop builds for all three OSes. And the Electron main/preload finally close the loop on the
   `window.remotedesk.capturer` bridge the screen-capture code was written against.


   Next number = Phase 4 Batch 2 (observability: structured logging, error tracking, health/readiness probes, Docker deploy
   for api+web). Bolo.

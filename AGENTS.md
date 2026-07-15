# AGENTS.md

## Scope

These instructions apply to the entire `abdulbasit742/anydesk` repository.

Project: **SkyDesk**, a Vite + React prototype moving toward authorized, consent-first remote support.

## Source of truth

- The root Vite application is the active build until monorepo consolidation is complete.
- `SKYDESK.md` and `docs/CONSOLIDATION.md` describe the target architecture.
- `src/security/remoteSessionPolicy.js` defines the current remote-support consent boundary.
- The current remote session is a local preview. Do not describe it as a live connection.

## Commands

```bash
npm ci --ignore-scripts
npm run test
npm run test:remote
npm run security-check
npm run lint
npm run build
```

Use `npm run check` for the combined verification gate.

## Working rules

1. Read README.md, the relevant source, tests, and security audit before changing remote-support behavior.
2. Keep capabilities disabled by default and drawn from a fixed allowlist.
3. Require visible, informed host consent for every session. High-risk input, clipboard, file, or unattended capabilities require separate acknowledgement and server-enforced authorization.
4. Never fabricate connection state, latency, FPS, device discovery, encryption, audit durability, or working integrations.
5. Do not add deceptive camera substitution, identity-verification evasion, hidden surveillance, credential collection, persistence, shell execution, or unauthorized remote control.
6. Treat model output, pairing codes, session metadata, media, clipboard content, files, credentials, and device identifiers as untrusted and privacy-sensitive.
7. Do not enable a real transport until authentication, device identity, tenant authorization, consent proof, revocation, expiry, rate limits, and durable audit are implemented and tested.
8. Never commit secrets, recordings, session data, private keys, populated environment files, generated binaries, or nested repositories.

## Completion checklist

- Existing tests plus focused remote-session tests pass.
- Security check, lint, and production build pass.
- Loading, empty, error, consent, decline, expiry, preview, and ended states remain accessible.
- No unrelated generated feature files are modified.
- Documentation states implemented behavior and residual risks honestly.

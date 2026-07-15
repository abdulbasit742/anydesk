# SkyDesk

SkyDesk is a large Vite + React prototype that is being consolidated into a consent-first, self-hostable remote-support product. The current repository contains a broad legacy dashboard plus early remote-support screens.

## Current remote-support boundary

The active remote-session experience is a **local consent-flow preview**. It can:

- create a short-lived support request;
- allowlist requested capabilities;
- require explicit host consent;
- require separate acknowledgement for input, clipboard, and file capabilities;
- show a session-local audit timeline;
- end or decline the request.

The transport is not implemented. The repository does **not** currently establish a remote connection, discover devices, capture a screen or camera, inject keyboard/mouse input, access clipboards, transfer files, or enable unattended access.

Any future media or control transport must be implemented behind authenticated signalling, explicit consent, scoped authorization, revocation, rate limits, durable audit, and independent security review.

## Safety position

This project is for authorized remote support only. Unauthorized access, surveillance, credential theft, deceptive camera substitution, identity-verification evasion, hidden control, and persistence without informed consent are outside the project scope.

Legacy documentation that described camera substitution for identity-verification services was inaccurate for the active source tree and has been removed.

## Local development

Requirements: Node.js compatible with the committed Vite version and npm.

```bash
npm ci --ignore-scripts
npm run dev
```

## Verification

```bash
npm run test
npm run test:remote
npm run security-check
npm run lint
npm run build
```

Or run the combined gate:

```bash
npm run check
```

The focused remote-session suite covers request expiry, scope validation, host consent, high-risk acknowledgement, allowed state transitions, local-preview semantics, end reasons, and bounded audit records.

## Repository direction

`SKYDESK.md` and `docs/CONSOLIDATION.md` describe the target monorepo. The root Vite application remains the active build while consolidation is incomplete. Generated feature sprawl should not be treated as implemented product capability without working code and tests.

## Documentation

- [SkyDesk target architecture](SKYDESK.md)
- [Consolidation record](docs/CONSOLIDATION.md)
- [Remote-support reference review](docs/reference-review.md)
- [Changed-area security audit](docs/security-audit.md)

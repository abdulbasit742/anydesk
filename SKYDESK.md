# SkyDesk

SkyDesk is the canonical, self-hostable remote support SaaS for web, Windows and mobile. This repository is the single source of truth for the former `anydesk`, `anydesklovable`, `remotedesk-mobile`, `anydeskantigravity1`, `longworking`, `RemoteDeskLive` and `skydesk_android` workstreams.

## Product rule

Core remote control ships before feature sprawl: connect by ID, explicit consent, WebRTC screen stream, input over data channel, file transfer, TURN fallback, session history and tamper-evident audit.

## Target layout

```text
apps/
  web/          SaaS dashboard and browser viewer
  desktop/      Electron Windows host and viewer
  mobile/       React Native mobile viewer
  api/          Auth, tenancy, device registry, signaling and billing
  relay/        TURN deployment and health tooling
packages/
  contracts/    Shared events, DTOs and validation
  ui/           Shared design system
  rtc/          WebRTC session engine
  security/     Consent, audit and policy primitives
legacy/         Imported prototypes kept for traceability
infra/          Docker, Postgres, Redis, MinIO and coturn
```

Run `powershell -ExecutionPolicy Bypass -File scripts/consolidate-skydesk.ps1` on the remote desktop to import every source without secrets or nested Git history.
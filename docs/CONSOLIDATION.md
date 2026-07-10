# SkyDesk consolidation record

## Canonical base

`abdulbasit742/anydesk` remains the canonical repository because it contains the newest fleet dashboard, QR pairing, lint remediation, test suite, Android workspace and live-demo launcher.

## Imported sources

| Source | Destination | Decision |
| --- | --- | --- |
| anydesklovable | legacy/dashboard-lovable | Preserve dashboard and Supabase UI, never import `.env` |
| remotedesk-mobile | apps/mobile | Canonical mobile client |
| anydeskantigravity1 | legacy/antigravity-prototype | Preserve signaling, Electron and host-agent prototype |
| longworking | legacy/longworking-audit | Do not duplicate source when identical to canonical base |
| C:\RemoteDeskLive | legacy/browser-mvp | Import the proven browser WebRTC MVP |
| skydesk_android | legacy/android-native | Import only when distinct from apps/mobile |

## Non-negotiable gates

1. Never commit `.env`, tokens, session data, recordings, credentials or generated binaries.
2. Explicit host consent is mandatory unless a scoped unattended-access grant exists.
3. Signaling carries metadata only. Media, input, clipboard and files use encrypted WebRTC channels.
4. Tenant ID comes from verified auth context, never from an untrusted client header alone.
5. TURN credentials are short-lived. Audit events are append-only and tamper-evident.
6. Billing, remote input and unattended access remain dry-run or disabled until their tests pass.

## Definition of a real MVP

Two clean Windows machines on different networks can connect by ID, accept or deny, view and control, transfer a file, reconnect after packet loss, and produce a complete audit record. Browser and Android clients use the same contracts. University-network traffic falls back to coturn over an allowed TLS route.
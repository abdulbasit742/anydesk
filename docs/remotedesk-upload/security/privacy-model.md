# Privacy Model

**Version:** 1.0.0  
**Last Updated:** 2026-06-12  
**Classification:** Internal — Security  
**Owner:** RemoteDesk Security Team

---

## 1. Overview

RemoteDesk is designed with privacy as a first-class architectural constraint. The core privacy principle is **data minimization**: collect only what is operationally necessary, retain it for only as long as required, and never route sensitive user data through servers that don't need it.

This document describes what data RemoteDesk collects, how it is processed, where it is stored, and how long it is retained.

---

## 2. Data Minimization

### 2.1 What We Collect and Why

| Data Type | Collected? | Purpose | Alternative Considered |
|---|---|---|---|
| Account email | ✅ Yes | Authentication, account recovery | Anonymous accounts (rejected: enterprise SSO requires email) |
| Display name | ✅ Yes | Identifying parties in session UI | None required |
| Connection ID (ephemeral) | ✅ Yes (session-only) | Peer discovery via signaling server | Permanent IDs (rejected: privacy) |
| Session metadata (start, end, duration) | ✅ Yes | Billing, audit compliance | Not collecting (rejected: regulatory requirement) |
| Audit events (consent, input counts, file transfer metadata) | ✅ Yes | Security audit trail | Not collecting (rejected: compliance requirement) |
| Screen video/audio stream | ❌ No (P2P only) | Never routed through servers | N/A — architectural guarantee |
| Clipboard content | ❌ No | Never stored or routed through servers | N/A — architectural guarantee |
| File transfer payloads | ❌ No | Never routed through servers | N/A — architectural guarantee |
| Input event content (keystrokes, mouse positions) | ❌ No (event counts only) | Audit logs record counts, not content | N/A |
| IP addresses | ✅ Yes (signaling only) | ICE candidate exchange (STUN/TURN) | Required for WebRTC; discarded post-ICE |
| Device fingerprint | ❌ No | Not collected | — |
| Browser/OS version | Partial (Electron version only) | Crash reporting | Full UA string (rejected: fingerprinting risk) |

### 2.2 Data We Explicitly Do Not Collect

- **Keystroke content**: Audit logs record the **count** of input events (e.g., "47 keyboard events in this session") but never the actual key codes or content of what was typed.
- **Mouse coordinates**: Audit logs do not record mouse coordinates or click targets — only event counts.
- **Screen content**: No screenshots, frame grabs, or recordings are made by RemoteDesk infrastructure.
- **Clipboard text**: The clipboard sync subsystem transmits text peer-to-peer; no server-side copy is made.
- **File contents**: File transfer payloads are transmitted peer-to-peer over WebRTC data channels; the relay server handles only the WebRTC signaling (SDP/ICE), not the file bytes.

---

## 3. Session Data Retention

### 3.1 Audit Logs

Audit event records are stored in the Prisma-managed database (`AuditEvent` table). They contain:
- Session ID (UUID)
- Event type (e.g., `CONSENT_INPUT_GRANTED`, `FILE_TRANSFER_ACCEPTED`)
- Timestamp (UTC)
- Actor IDs (host, viewer)
- Metadata specific to event type (e.g., file size, event count)
- **Never**: clipboard content, file content, keystroke sequences, screen content.

**Default retention: 90 days.**

After the retention period, audit records are automatically deleted via a scheduled database cleanup job. The cleanup is logged as an administrative event.

**Enterprise configurable**: Organizations may configure longer retention periods (up to 7 years for regulated industries) or shorter periods (30 days minimum). See `enterprise-policy.md`.

### 3.2 Session Metadata

Session start time, end time, and participant IDs are retained for:
- **Billing purposes**: 12 months (required for invoice disputes).
- **Audit compliance**: Same as audit log retention (90 days default).

After both retention windows expire, session metadata is deleted. A session record is never retained indefinitely.

### 3.3 User Account Data

Account data (email, display name, hashed password or SSO token) is retained for the life of the account plus 30 days after account deletion (to allow for accidental deletion recovery). After 30 days post-deletion, account data is purged permanently.

---

## 4. Screen Data

**Principle: Screen data is never stored.**

The screen share video stream is:
1. Captured on the host machine using OS screen capture APIs.
2. Encoded (VP8 or H.264) in the host's Electron renderer.
3. Transmitted via WebRTC (DTLS-SRTP encrypted) directly to the viewer's peer.
4. Decoded and rendered in the viewer's Electron renderer.
5. **Never passes through the RemoteDesk relay server.**

The relay server handles only WebRTC signaling (SDP offers/answers, ICE candidates) — not media bytes. There are no recording hooks, no server-side frame capture, and no transcoding infrastructure.

**DTLS-SRTP Encryption**: All media (audio/video) in the WebRTC stream is encrypted with DTLS-SRTP. The relay server, if used as a TURN server for NAT traversal, routes encrypted packets without being able to decrypt them. RemoteDesk does not hold DTLS session keys.

---

## 5. Clipboard Data

**Principle: Clipboard data is never stored on any server.**

When clipboard sync is enabled:
1. The sender's application reads the OS clipboard (`text/plain` only).
2. The text is transmitted via the WebRTC data channel (DTLS-encrypted) directly to the receiver.
3. The receiver's application writes the text to the OS clipboard.
4. No intermediate copy is stored — not in the relay server, not in the database, not in logs.

**Audit log records**: The audit log records that a clipboard sync occurred (direction, timestamp, content length in bytes) — **not the content itself**.

---

## 6. File Transfer Data

**Principle: File transfer payloads are never routed through servers.**

File transfer uses the WebRTC peer-to-peer data channel (SCTP over DTLS):
1. Sender reads the file from disk in 64 KB chunks.
2. Each chunk is transmitted via the encrypted data channel directly to the receiver.
3. The receiver assembles chunks in a temporary in-memory buffer.
4. After assembly and SHA256 verification, the receiver writes the file to disk (user-chosen location).

**The relay server sees**: WebRTC signaling only (SDP, ICE candidates) — not file bytes.

**Audit log records**: File transfer events include filename (sanitized), file size, SHA256 hash, direction, and outcome — **not the file content**.

---

## 7. User Identifiers

### 7.1 What Is Logged

| Identifier | Logged in Audit? | Logged in Session Metadata? | Notes |
|---|---|---|---|
| Session ID (UUID v4) | ✅ Yes | ✅ Yes | Ephemeral; generated per session; not linked to account ID in public-facing context |
| Host account ID | ✅ Yes | ✅ Yes | Needed for audit access control |
| Viewer account ID | ✅ Yes | ✅ Yes | Needed for audit access control |
| Connection ID | ✅ Yes (for duration of session) | ❌ No | Short-lived; recycled after session ends |
| IP address | ❌ No | ❌ No | Used for ICE only; never persisted |
| Email address | ❌ No | ❌ No | Authentication only; not in audit records |

### 7.2 What Is Ephemeral

- **Connection IDs**: Generated fresh for each session. Not stored post-session.
- **WebRTC session keys**: DTLS session keys are in-memory only and discarded when the session ends.
- **ICE candidates (IP addresses)**: Used during connection setup. Not logged or persisted.
- **Screen stream encryption keys**: In-memory only. Not recoverable after session.

### 7.3 Pseudonymization

Audit records reference internal account UUIDs, not email addresses or display names. The mapping from UUID to human-readable identity is held in a separate `Account` table accessible only to admins.

---

## 8. GDPR / CCPA Considerations

### 8.1 GDPR

| Right | RemoteDesk Support |
|---|---|
| Right to access (Art. 15) | Account holders can export their audit log data via the API (`GET /api/audit/export?format=json`) |
| Right to rectification (Art. 16) | Display name, email can be updated in account settings |
| Right to erasure (Art. 17) | Account deletion triggers 30-day grace period then full purge of account data and associated audit records |
| Right to data portability (Art. 20) | Audit log export in JSON and CSV formats |
| Right to restrict processing (Art. 18) | Account can be suspended (audit events paused) on request |
| Consent (Art. 7) | All feature-level permissions require explicit consent (see `consent-model.md`) |
| Data minimization (Art. 5(1)(c)) | No keystroke content, no screen recordings, no clipboard content stored |
| Breach notification (Art. 33) | Internal SLA: 24h to detect and assess; 72h to notify supervisory authority |

**Legal basis for processing:**
- Account data: Performance of contract (Art. 6(1)(b)).
- Audit logs: Legitimate interests (security, compliance) (Art. 6(1)(f)); overridden by explicit consent dialog for sensitive features.
- Session metadata: Performance of contract (billing).

### 8.2 CCPA

| Right | RemoteDesk Support |
|---|---|
| Right to know | Privacy Policy discloses all categories of data collected (see §2.1) |
| Right to delete | Account deletion request honored within 30 days |
| Right to opt-out of sale | RemoteDesk does not sell personal data |
| Right to non-discrimination | No degraded service for privacy-exercising users |

---

## 9. Enterprise Data Residency

### 9.1 Default Configuration

By default, RemoteDesk SaaS infrastructure is hosted in `us-east-1` (AWS). Signaling data and audit logs are stored in this region. Media and file transfer data is peer-to-peer and does not touch regional servers.

### 9.2 Enterprise Residency Options

Enterprise plans may configure:

- **EU data residency**: Signaling server and database in `eu-west-1` (Dublin, Ireland). Satisfies GDPR data transfer requirements without SCCs.
- **APAC data residency**: Signaling server in `ap-southeast-1` (Singapore).
- **Self-hosted / on-premises**: Enterprise customers may deploy the full RemoteDesk stack (signaling server, database, TURN server) on their own infrastructure. No data leaves the customer's network. Refer to `docs/deployment/self-hosted.md`.

### 9.3 TURN Server Considerations

If NAT traversal requires a TURN relay (peer-to-peer connection not possible), encrypted media/data packets may pass through the TURN server. In self-hosted mode, the TURN server is customer-controlled. In SaaS mode, the TURN server is RemoteDesk-operated and processes only encrypted packets (DTLS-SRTP), which it cannot decrypt.

Enterprise customers may specify their own TURN servers via the `iceServers` configuration.

---

## 10. Third-Party Sub-Processors

| Sub-Processor | Purpose | Data Shared |
|---|---|---|
| AWS (us-east-1) | Hosting, database, TURN server | Session metadata, audit logs (encrypted at rest) |
| Sentry (optional) | Error reporting | Electron version, error stack traces (no user content) |
| Stripe (billing) | Payment processing | Billing contact info only (not session data) |

RemoteDesk maintains a current sub-processor list at `remotedesk.app/legal/sub-processors`. Enterprise customers are notified of sub-processor changes with 30 days' notice.

---

## 11. References

- `docs/security/consent-model.md` — Per-feature consent flows
- `docs/security/audit-logging-model.md` — Audit log schema and retention
- `docs/security/enterprise-policy.md` — Enterprise data residency configuration
- GDPR (EU) 2016/679
- CCPA (California Civil Code § 1798.100 et seq.)
- NIST SP 800-188 (De-Identification of Personal Information)

# Threat Model: Clipboard Synchronization

**Version:** 1.0.0  
**Last Updated:** 2026-06-12  
**Classification:** Internal — Security  
**Owner:** RemoteDesk Security Team

---

## 1. Scope

Clipboard synchronization in RemoteDesk covers the mechanism by which clipboard contents are optionally shared between the viewer and host machines. This feature operates under strict constraints:

**In Scope:**
- **Text-only clipboard sync**: Plain text (`text/plain`) content only. No rich text, HTML, images, or binary blobs.
- **One-way sync (viewer → host)**: The viewer can paste text to the host's clipboard.
- **One-way sync (host → viewer)**: The host can share clipboard contents to the viewer.
- **Bidirectional sync**: Both directions active simultaneously.
- **Manual sync trigger**: User-initiated sync (click "Sync Clipboard" button).
- **Automatic sync on copy** (optional, requires explicit enable): Clipboard is synced when the user copies content in either direction.

**Out of Scope:**
- Binary file clipboard (handled by file transfer subsystem).
- HTML/RTF clipboard content (deliberately excluded).
- Image clipboard synchronization (deliberately excluded).
- Clipboard history synchronization.

---

## 2. Assets

| Asset | Description | Sensitivity |
|---|---|---|
| Host clipboard contents | Any text content on the host's OS clipboard | Variable (potentially Critical) |
| Viewer clipboard contents | Any text content on the viewer's OS clipboard | Variable (potentially Critical) |
| Sync permission state | Whether clipboard sync is enabled for the session | High |
| WebRTC data channel | The encrypted peer-to-peer channel carrying clipboard data | High |
| Audit log | Record of clipboard sync events | High |

---

## 3. Threat Actors

### 3.1 Passive Eavesdropper
An attacker who intercepts the signaling channel or WebRTC data channel to read clipboard contents.

**Motivation:** Credential theft (passwords copied to clipboard), sensitive data exfiltration.

### 3.2 Malicious Viewer
A session participant (viewer) who abuses clipboard sync to receive sensitive host clipboard data or to inject malicious content into the host's clipboard.

**Motivation:** Credential theft; injecting commands or malicious URLs that the host then pastes into terminals or browsers.

### 3.3 Malicious Host
A rogue host that deliberately triggers clipboard sync to exfiltrate sensitive content from the viewer's clipboard.

**Motivation:** Stealing credentials, API keys, or confidential documents the viewer may have copied.

### 3.4 Automated Script / Bot
An automated client that programmatically triggers clipboard sync at high frequency to probe for sensitive data or cause denial of service.

**Motivation:** Automated data harvesting; resource exhaustion.

---

## 4. Threats and Mitigations

### 4.1 Sensitive Data Leakage (Passwords, API Keys, Secrets)

**Description:** The user copies a password, API key, private key, or other secret to their clipboard while clipboard sync is active. This content is automatically or manually synced to the remote party, exposing the secret.

**Impact:** Credential theft; unauthorized access to external systems.

**Attack Scenarios:**
- Host copies database password from their password manager; viewer receives it via auto-sync.
- Viewer copies an API token from a config file; rogue host receives it via bidirectional sync.

**Mitigations:**

1. **No auto-enable**: Clipboard sync is **off by default** for every new session. It must be explicitly enabled by the host through a deliberate UI action.
2. **User confirmation dialog**: When clipboard sync is enabled, a dialog clearly states: "Warning: Enabling clipboard sync will share clipboard text with the remote party. Do not copy passwords or sensitive information while this is active." The user must click "I Understand, Enable."
3. **Persistent visual indicator**: While clipboard sync is active, a persistent indicator (clipboard icon with party name) is shown in the session status bar on both sides.
4. **No persistent storage**: Clipboard content is **never stored on the server** or in any database. It is transmitted peer-to-peer over the WebRTC data channel and exists only in RAM on both endpoints.
5. **Manual mode default**: Even when clipboard sync is enabled, the default mode is manual (user must click "Sync Clipboard"). Auto-sync on copy requires an additional toggle.
6. **Disable on sensitive app focus** (optional): An enterprise policy `disableClipboardOnPasswordManager: true` can detect when a known password manager has focus (by window title heuristic) and temporarily pause clipboard sync.

---

### 4.2 Clipboard Injection Attacks

**Description:** A malicious viewer sends crafted text to the host's clipboard that, when pasted into a terminal, browser, or other application, executes unintended commands or navigates to malicious URLs.

**Impact:** Remote code execution on host; phishing; SSRF if pasted into server-side code.

**Attack Scenarios:**
- Viewer sends `"; rm -rf /home/user --no-preserve-root; echo "` — if pasted into a bash terminal, executes destructive command.
- Viewer sends a crafted URL with unicode homoglyphs that appears legitimate in the clipboard viewer but navigates to a phishing site.
- Viewer sends ANSI escape sequences that alter terminal state.

**Mitigations:**

1. **Text-only restriction**: Only `text/plain` content is transmitted. No HTML, no RTF, no rich text that could embed hidden markup, hyperlinks, or formatting instructions.
2. **Strip ANSI/control characters**: The clipboard sync pipeline applies a sanitization pass that removes all control characters (Unicode category `Cc`) except for standard whitespace (`\n`, `\r`, `\t`, space). This prevents ANSI escape injection.
3. **Max size validation (1 MB hard limit)**: Clipboard content exceeding 1,048,576 bytes is rejected at the sender side. The receiver also validates the size before writing to the OS clipboard.
4. **No automatic paste**: RemoteDesk **never automatically pastes** clipboard content into any application. The content is only written to the OS clipboard; the user must explicitly perform the paste action.
5. **User awareness prompt on first sync**: On the first sync per session, a toast notification informs the user: "Clipboard updated from [ViewerName]. Review before pasting."
6. **Audit log of all syncs**: Every clipboard sync event is recorded (direction, timestamp, content length — **not content**) in the `AuditEvent` table.

---

### 4.3 Size-Based Denial of Service

**Description:** An attacker sends very large clipboard payloads at high frequency to exhaust the receiver's memory or network bandwidth.

**Impact:** Application crash; host system instability; session degradation.

**Mitigations:**

1. **Hard size limit of 1 MB**: Any clipboard payload exceeding 1 MB is rejected at the WebRTC data channel receiver before writing to memory. The sender receives an error event.
2. **Rate limiting**: A maximum of **1 clipboard sync per 2 seconds** is enforced per session per direction. Excess requests are queued and debounced, not dropped, ensuring the last sync always completes.
3. **Debouncing**: When auto-sync mode is enabled, clipboard change events are debounced with a 500ms trailing delay to prevent rapid successive syncs from flooding the channel.
4. **Bounded memory**: The clipboard sync buffer is allocated with a fixed maximum size. The application does not dynamically grow memory to accommodate oversized payloads.

---

### 4.4 Timing Attacks on Clipboard Content

**Description:** An attacker uses timing side-channels to infer the length or nature of clipboard contents, even without directly reading them.

**Impact:** Partial information leakage (e.g., inferring password length).

**Attack Scenarios:**
- An attacker measures the transmission time of clipboard sync messages to infer content length.
- An attacker correlates sync timestamps with known user actions (e.g., "sync occurred 500ms after login dialog opened") to infer the user copied a password.

**Mitigations:**

1. **Fixed-size framing**: Clipboard content is padded to the nearest 256-byte boundary before transmission. This prevents exact length inference.
2. **Transport encryption**: All WebRTC data channel traffic is encrypted with DTLS 1.3. Packet sizes visible to a network observer do not reveal unpadded content length beyond the 256-byte granularity.
3. **Jitter on auto-sync**: When auto-sync is enabled, a random jitter of 0–200ms is added to the sync trigger to prevent precise timing correlation with user clipboard events.

---

### 4.5 Race Conditions in Bidirectional Sync

**Description:** When bidirectional sync is enabled and both parties copy content simultaneously, the system enters a conflicted state where one or both parties' clipboard contents are lost or one party's clipboard is overwritten with the other's content unexpectedly.

**Impact:** Data loss; unexpected clipboard overwrites; confusion for users.

**Attack Scenarios:**
- Both viewer and host copy new content within the same 100ms window. A naïve sync protocol results in a feedback loop where each sync triggers another sync.
- An attacker deliberately triggers rapid clipboard changes to cause the sync protocol to thrash.

**Mitigations:**

1. **Sender-wins with sequence numbers**: Each clipboard sync message carries a monotonically increasing sequence number. If a receiver receives a sync message with a sequence number older than the last locally-initiated sync, it is discarded.
2. **Bidirectional lock with cooldown**: After syncing in one direction, a 1-second cooldown is enforced before a sync in the opposite direction can occur. This breaks feedback loops.
3. **Conflict notification**: If a conflict is detected (simultaneous syncs within the debounce window), both parties are notified with a toast: "Clipboard conflict — your content was preserved." The local clipboard is never overwritten without user awareness.
4. **Opt-in bidirectional mode**: Bidirectional sync requires an additional confirmation step beyond unidirectional sync. It defaults to host→viewer only when clipboard sync is first enabled.

---

### 4.6 Passive Network Eavesdropping

**Description:** A network adversary intercepts clipboard data in transit.

**Impact:** Sensitive data leakage to unintended parties.

**Mitigations:**

1. **DTLS-SRTP on WebRTC data channel**: All peer-to-peer data (including clipboard sync) is encrypted with DTLS 1.3. The signaling channel uses TLS 1.3 with HSTS.
2. **No server-side routing of clipboard data**: Clipboard content passes through the WebRTC peer-to-peer data channel. The signaling relay server only passes ICE candidates and SDP offers/answers — it never handles clipboard payload data.
3. **Forward secrecy**: DTLS session keys are ephemeral (ECDHE). Capturing ciphertext now does not allow decryption if keys are later compromised.

---

## 5. Residual Risks

| Risk | Likelihood | Impact | Accepted? | Notes |
|---|---|---|---|---|
| User copies password while sync is active and ignores indicator | High | Critical | Partial | Primary mitigation is UX (warning dialog, indicator). Cannot prevent user error. |
| Host OS clipboard accessible to other local apps | High | High | Yes | This is an OS-level behavior. RemoteDesk cannot control OS clipboard access controls. |
| Terminal paste injection despite plain-text restriction | Medium | High | Partial | Plain text can still contain dangerous shell commands. Mitigation relies on user review before pasting. |
| Timing correlation by sophisticated adversary | Low | Low | Yes | 256-byte padding + jitter provides reasonable protection; full prevention would require constant-time padding to max size (1 MB per sync), which is impractical. |
| Clipboard sync used as covert channel for data exfiltration | Low | High | Partial | Audit log (content length + direction) provides forensic capability. Size limit constrains exfiltration bandwidth. |

---

## 6. Security Controls Summary

| Control | Layer | Mandatory? |
|---|---|---|
| No auto-enable (off by default) | Session management | ✅ Yes |
| User confirmation dialog with explicit warning | UI layer | ✅ Yes |
| Text-only (`text/plain`) restriction | Data channel handler | ✅ Yes |
| Strip ANSI/control characters | Clipboard sanitizer | ✅ Yes |
| Max size 1 MB hard limit | Sender + Receiver | ✅ Yes |
| Rate limit (1 sync / 2s per direction) | Data channel handler | ✅ Yes |
| 500ms debounce on auto-sync | Clipboard watcher | ✅ Yes |
| 256-byte padding for size obfuscation | Data channel framing | ✅ Yes |
| Audit log (direction, length, timestamp) | Main process → Prisma | ✅ Yes |
| No server-side clipboard data routing | Architecture | ✅ Yes |
| DTLS 1.3 encryption of data channel | WebRTC layer | ✅ Yes |
| Persistent visual indicator while active | UI overlay | ✅ Yes |
| Sequence numbers for bidirectional dedup | Data channel protocol | ✅ Yes |
| Disable on password manager focus | Enterprise policy | Optional |

---

## 7. References

- `docs/security/consent-model.md` — Consent requirements for clipboard sync
- `docs/security/audit-logging-model.md` — AuditEvent schema
- `docs/security/privacy-model.md` — Data minimization for clipboard
- OWASP Clipboard Security Considerations
- RFC 8826 (WebRTC Security Architecture)

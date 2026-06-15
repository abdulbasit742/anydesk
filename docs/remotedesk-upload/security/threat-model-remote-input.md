# Threat Model: Remote Input Control

**Version:** 1.0.0  
**Last Updated:** 2026-06-12  
**Classification:** Internal — Security  
**Owner:** RemoteDesk Security Team

---

## 1. Scope

Remote input control encompasses all mechanisms by which the **viewer** (remote party) can synthesize keyboard and mouse events that are executed on the **host** (local machine). This includes:

- **Keyboard input**: Alphanumeric keys, modifier keys (Ctrl, Alt, Shift, Meta/Win), function keys, and system-level shortcuts.
- **Mouse input**: Cursor movement (absolute and relative), left/right/middle button clicks, scroll wheel events, and pointer lock.
- **System-level inputs**: Key combos that interact with the OS shell (e.g., Ctrl+Alt+Del on Windows, Cmd+Space on macOS).
- **Input injection timing**: Burst injection, sustained hold events, and synthetic repeat events.

Remote input control is **NOT** in scope:
- Audio/video capture or transmission (separate subsystem).
- File transfer (covered in `threat-model-file-transfer.md`).
- Clipboard synchronization (covered in `threat-model-clipboard.md`).

---

## 2. Assets

| Asset | Description | Sensitivity |
|---|---|---|
| Host OS input surface | The native OS input injection APIs (`robot.js`, `uiohook`, Win32 `SendInput`) | Critical |
| Host process privileges | Electron main process running with elevated or standard OS privileges | High |
| Session authorization state | Whether remote input is currently permitted for the active session | Critical |
| Audit log integrity | Immutable record of all input events for forensic review | High |
| Host visual indicator | On-screen indicator showing remote control is active | Medium |

---

## 3. Threat Actors

### 3.1 External Attacker
An unauthenticated or unauthorized third party attempting to gain input control over a host machine without the host's consent.

**Motivation:** Data theft, ransomware delivery, surveillance.  
**Capability:** Network-level adversary, may possess captured session tokens.

### 3.2 Malicious Viewer
A party who has legitimately obtained a session connection (e.g., was invited by the host or social-engineered the host into accepting), but then abuses remote input capabilities.

**Motivation:** Privilege escalation, data exfiltration, planting malware.  
**Capability:** Valid session credentials; operates within the protocol.

### 3.3 Rogue Host (Reverse Attack)
A malicious host that has tricked the viewer into connecting to it, and then exploits timing windows or protocol flaws to push input events back to the viewer's machine.

**Motivation:** Lateral movement; compromise the viewer's environment.  
**Capability:** Controls the server-side relay; may craft malformed WebRTC signaling messages.

### 3.4 Insider Threat
An enterprise operator or administrator who has policy-level access to enable or bypass input controls.

**Motivation:** Unauthorized surveillance, sabotage.  
**Capability:** Access to enterprise policy API and audit logs.

---

## 4. Attack Vectors & Mitigations

### 4.1 Unauthorized Input Injection

**Description:** An attacker injects keyboard or mouse events on the host without the host having granted remote input permission. This may occur via replayed session tokens, race conditions in the permission grant handshake, or exploitation of a bug in the IPC boundary.

**Impact:** Full control of the host machine; arbitrary code execution.

**Mitigations:**

1. **Permission gate in main process**: The Electron main process maintains an authoritative boolean `inputEnabled` state per session. All IPC messages containing input events are validated against this flag before any OS-level injection call is made. The renderer process has **no direct access** to input injection APIs.
2. **Cryptographic session tokens**: Each session is bound to a server-issued, signed JWT. The WebSocket relay validates the token on every message frame, not just on connection.
3. **Double-confirmation handshake**: Remote input must be explicitly enabled via a two-step dialog: (a) viewer requests input control; (b) host clicks "Allow" in a system-tray-visible dialog. A single compromised path cannot bypass both steps.
4. **State machine enforcement**: The session state machine rejects input events in states other than `SESSION_ACTIVE_INPUT_ENABLED`. Any out-of-order message causes the session to terminate.

---

### 4.2 Privilege Escalation via Injected Key Combos

**Description:** A malicious viewer uses remote input to inject OS-level key combinations that open administrator prompts, spawn elevated shells, or trigger UAC elevation dialogs.

**Impact:** Escalation from viewer context to OS-level administrator privileges.

**Mitigations:**

1. **Blocked key combos list**: A static blocklist is enforced in the main process before any injection call:
   - Windows: `Ctrl+Alt+Del`, `Win+L` (lock), `Win+R` (run), `Alt+F4` (close), `Win+X` (power user menu), `Ctrl+Shift+Esc` (task manager)
   - macOS: `Cmd+Space` (Spotlight), `Cmd+Option+Esc` (force quit), `Ctrl+Cmd+Q` (lock screen)
   - Linux: `Ctrl+Alt+T` (terminal), `Ctrl+Alt+F1–F6` (VT switch)
2. **UAC / polkit interception**: On Windows, the `UIPI` (User Interface Privilege Isolation) layer prevents injection into elevated windows from a non-elevated Electron process by default. RemoteDesk does **not** request elevation for input injection.
3. **Function key suppression policy**: F-key sequences (F1–F12) can be disabled entirely via enterprise policy `blockFunctionKeys: true`.

---

### 4.3 Keystroke Logging by Viewer

**Description:** A viewer, once granted input control, monitors the host's typed content by correlating injected keystrokes with responses (e.g., watching cursor movement on screen to infer passwords typed in a different application).

**Impact:** Credential theft, sensitive data exposure.

**Mitigations:**

1. **Audit logging of all injected events**: Every keystroke injection is logged to the `AuditEvent` table (see `audit-logging-model.md`) with timestamp, key code, and session ID. This provides a forensic record of what was injected.
2. **Visual indicator on host**: A persistent, always-on-top overlay badge displays "🔴 Remote Control Active" with the viewer's ID while input is enabled. The host user can observe what the viewer is injecting.
3. **Input echo suppression**: The application does not transmit a "keystroke echo" back to the viewer; the viewer only sees the result on the screen share feed.
4. **No credential field detection bypass**: RemoteDesk does not attempt to detect password fields or suppress logging for them — everything is logged equally, which means the audit log serves as a deterrent.

---

### 4.4 Mouse Jacking (Cursor Hijacking)

**Description:** The viewer rapidly moves the mouse cursor to interfere with the host user's ability to interact with their own machine, or to click UI elements that the host did not intend to activate.

**Impact:** Denial of service to host; unauthorized UI interactions.

**Mitigations:**

1. **Rate limiting on mouse events**: The main process enforces a maximum of **250 mouse move events per second** and **20 click events per second**. Events exceeding this rate are dropped and logged.
2. **Emergency stop**: The host can press a configurable hotkey (default: `F12` or `Ctrl+Shift+F12`) to **immediately terminate all remote input** without opening any dialog. This is handled at the OS hook level, independent of the application UI.
3. **Cursor indicator**: A distinct colored ring is rendered around the remote cursor, distinct from the host's native cursor, so the host can visually distinguish remote vs. local mouse actions.
4. **Host mouse override**: Local host mouse events always take priority. If the host moves the mouse, a 500ms grace period suppresses viewer mouse input.

---

### 4.5 Blind-Spot Attacks During Permission Grant Flow

**Description:** During the permission grant dialog (the window where the host is asked to approve remote input), the viewer sends input events that arrive after the permission is granted but before the host dismisses the dialog — exploiting the small window of ambiguity.

**Impact:** Unintended actions executed immediately after permission grant.

**Mitigations:**

1. **500ms input injection delay**: After the host clicks "Allow," there is a mandatory 500ms delay before the first remote input event is processed. This prevents "click hijacking" of the confirmation button itself.
2. **Dialog window exclusion**: The permission dialog window is marked as input-injection-excluded by PID. Even after permission is granted, the dialog window itself cannot receive injected inputs.
3. **Permission grant animation**: A visible countdown animation (3 seconds) is shown before remote input becomes active, giving the host a clear visual cue.
4. **Confirmation logging**: The exact timestamp of permission grant is recorded in the audit log along with the first input injection timestamp, allowing detection of suspiciously rapid post-grant input.

---

### 4.6 Session Replay Attack

**Description:** An attacker captures a valid session token (e.g., via TLS interception or log exposure) and replays it to gain input control outside the original session.

**Impact:** Unauthorized remote control using a stale session.

**Mitigations:**

1. **Short-lived session tokens**: JWTs have a maximum TTL of 1 hour. Refresh tokens require re-authentication.
2. **Per-session nonce**: Each session token contains a random nonce that is bound to the WebSocket connection ID. Replaying the token on a different connection fails signature validation.
3. **Token rotation on state change**: Whenever the session state changes (e.g., input enabled/disabled), the session token is rotated. Old tokens are invalidated.

---

### 4.7 Input Event Flooding (DoS)

**Description:** A viewer sends a very high volume of input events to overwhelm the host's input processing pipeline, causing CPU/memory exhaustion.

**Impact:** Host machine becomes unresponsive; denial of service.

**Mitigations:**

1. **Event queue bounded buffer**: The main process maintains a bounded ring buffer (max 1,000 events) for incoming input events. Events arriving when the buffer is full are silently dropped.
2. **Rate limiting with backpressure**: If the event rate exceeds 500 events/second across all types, the session is flagged and the viewer receives a `rate-limit-warning` message. If the rate continues for 5 seconds, remote input is automatically disabled.
3. **Automatic session suspension**: Anomaly detection (see `abuse-prevention.md`) will suspend the session if sustained flood patterns are detected.

---

## 5. Residual Risks

| Risk | Likelihood | Impact | Accepted? | Rationale |
|---|---|---|---|---|
| OS-level clipboard sniffing via injected shortcuts | Medium | High | Partial | Blocked combos mitigate most paths; OS-level clipboard access by injected keys (e.g., Ctrl+C on open password manager) cannot be fully prevented without restricting all text selection. Mitigated by audit logging. |
| Zero-day in OS input injection API | Low | Critical | Yes | This is outside RemoteDesk's control. Defense-in-depth (session tokens, rate limiting) reduces blast radius. |
| Social engineering to grant input permission | High | Critical | Partial | User education and visual indicators are the primary mitigations. Technical controls cannot prevent a host from clicking "Allow" under social pressure. |
| Screen-visible credential theft | High | High | Yes | Once screen sharing + input control are active, a sufficiently attentive viewer could observe credentials. Audit log and visual indicator are the mitigations; full prevention would require disabling screen share. |
| Privilege escalation through 3rd-party app bug | Low | High | Yes | A bug in a 3rd-party accessibility app running on the host could be exploited by injected input. This is an accepted OS-level risk. |

---

## 6. Security Controls Summary

| Control | Implementation Layer | Mandatory? |
|---|---|---|
| `inputEnabled` flag in main process | Electron main process (IPC handler) | ✅ Yes |
| Blocked key combos list | Main process, pre-injection filter | ✅ Yes |
| Rate limiting (250 mouse/s, 20 click/s) | Main process, event queue | ✅ Yes |
| Visual indicator on host (always-on-top overlay) | Renderer (host-side overlay window) | ✅ Yes |
| Emergency stop hotkey | OS-level hook (independent of app UI) | ✅ Yes |
| 500ms post-grant delay | Main process, session state machine | ✅ Yes |
| Audit logging of all injected events | Main process → Prisma DB | ✅ Yes |
| Per-session cryptographic tokens | Server-side JWT, rotated on state change | ✅ Yes |
| Event queue bounded buffer (1,000 events) | Main process | ✅ Yes |
| Automatic session suspension on flood | Main process anomaly detector | ✅ Yes |
| Blocked combos enterprise extension | Enterprise policy API | Optional |
| Function key suppression policy | Enterprise policy API | Optional |
| IP allowlist for input-control sessions | Enterprise policy API | Optional |

---

## 7. References

- `docs/security/consent-model.md` — Formal consent lifecycle for remote input permission
- `docs/security/audit-logging-model.md` — AuditEvent schema and storage
- `docs/security/abuse-prevention.md` — Anomaly detection and reporting
- `docs/security/enterprise-policy.md` — Policy enforcement for enterprise deployments
- OWASP Desktop App Security Top 10
- NIST SP 800-46 Rev 2 (Guide to Enterprise Telework, Remote Access, and BYOD Security)

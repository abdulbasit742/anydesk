# RemoteDesk — Penetration Test Checklist

> **Version:** 1.0  
> **Last Updated:** 2026-06-12  
> **Tester:** ___________________  
> **Environment:** Staging (never run against production without written authorization)  
> **Scope:** Electron client ↔ Signaling server ↔ WebRTC data channels

---

## Severity Scale

| Rating | Definition |
|--------|-----------|
| **Critical** | Allows unauthorized control of a remote machine or exfiltration of private data |
| **High** | Allows session hijacking, ID prediction, or bypass of consent dialogs |
| **Medium** | Denial-of-service, information disclosure, or degraded safety controls |
| **Low** | Minor information leak, UI-only bypass with no real-world impact |

---

## PT-001 — Authentication Bypass Attempts

| Field | Value |
|-------|-------|
| **Category** | Authentication |
| **Severity if Fails** | Critical |

**Description:** Attempt to establish a session without completing the host's password challenge.

**Steps:**
1. Capture a valid `connect:request` signaling message using a network proxy (e.g., mitmproxy) or browser/Electron DevTools.
2. Replay the captured `connect:request` to the server, omitting the `passwordHash` field entirely.
3. Replay again with `passwordHash: ""` (empty string).
4. Replay again with `passwordHash: null`.
5. Replay again with a random 64-character hex string as the hash.
6. For each attempt, observe whether the server accepts or rejects the connection.

**Expected Result:** Every attempt without the correct PBKDF2/bcrypt hash is rejected with a `request:rejected` event. The server never forwards any of these requests to the host's `incoming:request` handler.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-002 — Connection ID Enumeration (Brute Force 9-digit IDs)

| Field | Value |
|-------|-------|
| **Category** | Authorization / Rate Limiting |
| **Severity if Fails** | High |

**Description:** Attempt to discover valid RemoteDesk IDs by sending a large volume of `connect:request` messages with incrementing or random 9-digit IDs.

**Steps:**
1. Write a simple WebSocket client script that sends `connect:request` events to the signaling server with sequential IDs starting from `000000001`.
2. Send 10 requests/second for 1 minute (600 total).
3. Observe server response: does it reveal which IDs are valid vs invalid (timing oracle or distinct error codes)?
4. Verify whether the server rate-limits by IP, by source connection ID, or globally.
5. Check server logs: is the enumeration attempt logged and an alert triggered?

**Expected Result:**
- All requests exceeding the rate limit (5 requests/min per source) are rejected with HTTP 429 or a WebSocket-level error.
- The server returns the same error response for both valid and invalid target IDs (no timing oracle).
- After rate limit is hit, the source IP is temporarily blocked (cooldown ≥ 60 s).
- An audit log entry is created after ≥ 5 failed attempts.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-003 — Remote Input Injection Without Permission

| Field | Value |
|-------|-------|
| **Category** | Authorization / Input Handling |
| **Severity if Fails** | Critical |

**Description:** Attempt to inject mouse/keyboard events to a host machine when the `remoteInput` permission has not been granted.

**Steps:**
1. Establish a valid session (connection accepted by host).
2. Do NOT request or receive `remoteInput` permission.
3. Open the Electron DevTools on the viewer or intercept the WebRTC data channel.
4. Craft and send a valid `input:pointer` or `input:keyboard` envelope directly to the data channel.
5. Observe host machine for any cursor movement or keystroke.
6. Repeat with slightly malformed envelopes (wrong version, extra fields).

**Expected Result:** All `input:*` messages are silently dropped or responded with `error` if the current session does not have an active `remoteInput` grant. The host machine shows no cursor movement or keystrokes. An audit event is logged for each unauthorized input attempt.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-004 — Clipboard Injection: Crafted Large Payload (> 1 MB)

| Field | Value |
|-------|-------|
| **Category** | Input Validation / DoS |
| **Severity if Fails** | Medium |

**Description:** Send a clipboard sync message whose payload exceeds 1 MB to test the receiver's size validation.

**Steps:**
1. Establish a valid session with clipboard sync enabled.
2. Intercept (or directly write to) the WebRTC data channel.
3. Construct a `clipboard:sync` envelope with a `text` field containing exactly 1,048,577 bytes (1 MB + 1 byte) of repeated characters.
4. Send the message.
5. Observe: does the receiver's process crash, hang, or silently accept the oversized payload?
6. Repeat with 10 MB, then 100 MB payloads.

**Expected Result:** The receiver validates the message size before processing. Payloads exceeding 1 MB are silently dropped and an audit warning is logged. The receiving process does not crash, spike memory, or update the OS clipboard with the oversized content.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-005 — File Transfer: Path Traversal Filename (`../../../etc/passwd`)

| Field | Value |
|-------|-------|
| **Category** | Path Traversal / File System Security |
| **Severity if Fails** | Critical |

**Description:** Send a file transfer initiation message with a path-traversal filename to attempt writing outside the designated download directory.

**Steps:**
1. Establish a valid session with file transfer permission granted.
2. Craft a `file:transfer:init` message with `filename: "../../../etc/passwd"` (Linux) or `..\..\..\Windows\System32\evil.exe` (Windows).
3. Send the message via the WebRTC data channel (or via patched client).
4. Host auto-accepts (or manually accept the consent dialog, which should show the sanitized name).
5. After transfer, inspect the host's filesystem:
   - Is any file created outside the download directory?
   - Is `/etc/passwd` or a system file overwritten?
6. Repeat with variations: `....//....//etc/passwd`, URL-encoded `%2e%2e%2f`, null byte injection `evil\0.txt`.

**Expected Result:** The host sanitizes the filename to the base component (`passwd` or `evil.exe`) before any disk write. All files are written exclusively to the designated RemoteDesk download directory. No system files are modified. The consent dialog shows the sanitized filename.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-006 — File Transfer: File Exceeding 100 MB

| Field | Value |
|-------|-------|
| **Category** | Input Validation / DoS |
| **Severity if Fails** | Medium |

**Description:** Attempt to send a file whose declared size exceeds the 100 MB limit.

**Steps:**
1. Establish a valid session with file transfer permission granted.
2. Craft a `file:transfer:init` message with `size: 104857601` (100 MB + 1 byte) and a valid filename.
3. Send the initiation message.
4. Observe: does the host reject the transfer before any data is sent?
5. Also test by sending a transfer initiation claiming a size of 1 GB (`1073741824`).
6. Attempt to bypass by claiming a small size in the init message but then sending more data than declared.

**Expected Result:**
- Transfers exceeding 100 MB are rejected at the initiation phase (no consent dialog shown, or consent dialog shows a rejection reason).
- No disk space is pre-allocated for an oversized transfer.
- If the sender sends more bytes than the declared size, the receiver aborts the transfer and deletes any partial file.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-007 — File Transfer: Zip Bomb (1 GB Uncompressed in Small Archive)

| Field | Value |
|-------|-------|
| **Category** | Resource Exhaustion / DoS |
| **Severity if Fails** | High |

**Description:** Send a zip bomb (e.g., a 42 KB `.zip` that decompresses to ~1 GB) to test whether the application blindly decompresses received files.

**Steps:**
1. Download or create a known zip bomb (e.g., zbsm.zip from zblg.zip family — 42 KB → 5.5 GB). Reference: https://www.bamsoftware.com/hacks/zipbomb/
2. Initiate a file transfer with the zip bomb (size ≤ 100 MB threshold in compressed form; declare the actual compressed file size).
3. Host accepts the transfer.
4. Observe: does the host application automatically extract the archive? Does disk usage spike?
5. Check if the application performs any decompression or if it treats all files as binary blobs.

**Expected Result:** RemoteDesk does NOT automatically decompress archives. Files are treated as binary blobs and saved as-is. Disk write is bounded by the declared and verified file size (≤ 100 MB). No disk exhaustion occurs.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-008 — Emergency Stop Bypass: Continue Sending Input After Stop

| Field | Value |
|-------|-------|
| **Category** | Authorization / Control Bypass |
| **Severity if Fails** | Critical |

**Description:** After the host triggers emergency stop, attempt to continue forwarding input events through the data channel.

**Steps:**
1. Establish a session with `remoteInput` permission granted.
2. Host triggers emergency stop (button or keyboard shortcut).
3. Immediately (within 500 ms) send a `input:pointer` event directly via the data channel from the viewer side.
4. Observe whether the host processes the event (cursor movement or click).
5. Wait 5 seconds and try again.
6. Also attempt to re-grant permission from the viewer side by sending a `permission:grant` envelope without host interaction.

**Expected Result:** After emergency stop, all `input:*` messages are rejected at the host without executing. The host's permission state for `remoteInput` is `revoked`. A viewer-side `permission:grant` message is ignored (only the host can grant permissions). No input events execute on the host after stop.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-009 — Data Channel Message Fuzzing: Malformed Envelopes

| Field | Value |
|-------|-------|
| **Category** | Input Validation / Robustness |
| **Severity if Fails** | High |

**Description:** Send malformed or unexpected message envelopes over the WebRTC data channel to test for crashes, undefined behavior, or security bypasses.

**Steps:**
1. Establish a valid session.
2. Send the following malformed messages over the data channel (send each individually, observe behavior after each):
   a. Empty string `""`.
   b. Raw binary data (non-UTF-8 bytes).
   c. Valid JSON but unknown `type` field: `{"version":1,"type":"unknown:event","payload":{}}`.
   d. Valid JSON but wrong version: `{"version":99,"type":"input:pointer","payload":{}}`.
   e. JSON missing required fields: `{"type":"input:pointer"}` (no version, no payload).
   f. Deeply nested JSON (1000 levels deep).
   g. JSON with extremely long string field values (1 MB string in a non-payload field like `type`).
   h. Duplicate fields in JSON: `{"version":1,"version":2,"type":"heartbeat"}`.
   i. Array at the root level instead of object: `[1,2,3]`.
   j. `null` value: `null`.

**Expected Result:** The receiving side gracefully rejects all malformed messages. No crash, hang, or memory spike occurs. Unknown message types are logged and dropped. Version mismatches are logged and dropped. The session continues normally after each invalid message.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-010 — WebRTC ICE Stuffing: Flood with Invalid ICE Candidates

| Field | Value |
|-------|-------|
| **Category** | Denial of Service / Protocol Abuse |
| **Severity if Fails** | Medium |

**Description:** Flood the signaling server and/or peer with a high volume of invalid ICE candidates to cause denial of service or connection instability.

**Steps:**
1. Intercept the WebSocket connection to the signaling server.
2. Send 10,000 `webrtc:ice` messages in rapid succession with invalid ICE candidate strings (e.g., random garbage or structurally valid but non-routeable addresses).
3. Observe signaling server CPU and memory usage.
4. Observe whether the victim peer's WebRTC connection degrades or drops.
5. Separately, open 100 simultaneous WebSocket connections to the signaling server from a single IP.
6. Observe whether the signaling server rate-limits or crashes.

**Expected Result:**
- Signaling server rate-limits ICE candidate messages per session (e.g., max 100 candidates/session).
- Excess ICE messages are dropped with a rate-limit error; they are not forwarded to the peer.
- The peer's existing WebRTC connection is not affected by the flood.
- Server resource usage remains stable; no OOM or crash.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-011 — Session Replay: Save and Replay a Signaling Sequence

| Field | Value |
|-------|-------|
| **Category** | Session Security / Replay Attack |
| **Severity if Fails** | High |

**Description:** Capture a complete successful signaling handshake (offer → answer → ICE) and replay it to attempt to hijack or re-open a session.

**Steps:**
1. Use mitmproxy or a custom WebSocket interceptor to record a complete successful session establishment sequence.
2. Save the sequence: `connect:request`, `request:accepted`, `webrtc:offer`, `webrtc:answer`, all `webrtc:ice` messages.
3. After the original session ends, replay the complete sequence from a different WebSocket connection.
4. Observe: does the server accept the replayed offer? Does a new session open on the host?
5. Also replay only the `webrtc:offer` with a freshly opened (but unauthorized) data channel.

**Expected Result:**
- Session tokens (or equivalent nonces) are single-use and expire immediately after session teardown.
- Replayed signaling messages are rejected with an authentication error.
- ICE credentials embedded in offers are rotated per session and are not valid for new connections.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## PT-012 — Signaling Rate Limits: Exceed 5 connect:request/min

| Field | Value |
|-------|-------|
| **Category** | Rate Limiting / DoS Protection |
| **Severity if Fails** | Medium |

**Description:** Verify that the signaling server enforces the documented rate limit of 5 `connect:request` events per minute per source connection.

**Steps:**
1. Open a WebSocket connection to the signaling server.
2. Send 5 valid `connect:request` messages (targeting a real or dummy host ID) within 60 seconds.
3. Send a 6th `connect:request` within the same minute window.
4. Observe the server's response to the 6th request.
5. Wait for the rate limit window to reset (60 s) and send a valid 6th request.
6. Test with multiple parallel WebSocket connections from the same IP to verify per-IP limiting is also applied.

**Expected Result:**
- The 6th `connect:request` within 60 seconds is rejected with an `error` event: `{ code: "RATE_LIMIT_EXCEEDED", retryAfter: <seconds> }`.
- The host does NOT receive the 6th request.
- After the window resets, the 6th request succeeds normally.
- Per-IP rate limiting prevents bypass via multiple connections from the same source IP.

**Pass / Fail:** ☐ Pass ☐ Fail

**Evidence / Notes:**
```
(screenshot, packet capture path, or notes)
```

---

## Summary Table

| Test ID | Category | Severity if Fails | Result |
|---------|----------|-------------------|--------|
| PT-001 | Authentication | Critical | ☐ Pass ☐ Fail |
| PT-002 | Rate Limiting / Enumeration | High | ☐ Pass ☐ Fail |
| PT-003 | Remote Input Authorization | Critical | ☐ Pass ☐ Fail |
| PT-004 | Clipboard Injection / DoS | Medium | ☐ Pass ☐ Fail |
| PT-005 | Path Traversal | Critical | ☐ Pass ☐ Fail |
| PT-006 | File Size Validation | Medium | ☐ Pass ☐ Fail |
| PT-007 | Zip Bomb / Resource Exhaustion | High | ☐ Pass ☐ Fail |
| PT-008 | Emergency Stop Bypass | Critical | ☐ Pass ☐ Fail |
| PT-009 | Data Channel Fuzzing | High | ☐ Pass ☐ Fail |
| PT-010 | ICE Flooding / DoS | Medium | ☐ Pass ☐ Fail |
| PT-011 | Session Replay | High | ☐ Pass ☐ Fail |
| PT-012 | Signaling Rate Limits | Medium | ☐ Pass ☐ Fail |

**Sign-off:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tester | | | |
| Security Lead | | | |
| Release Manager | | | |

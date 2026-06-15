# Threat Model: File Transfer

**Version:** 1.0.0  
**Last Updated:** 2026-06-12  
**Classification:** Internal — Security  
**Owner:** RemoteDesk Security Team

---

## 1. Scope

File transfer in RemoteDesk enables the optional, consent-gated transfer of files between viewer and host over the WebRTC peer-to-peer data channel. Key architectural facts:

- **Direct P2P**: Files are transferred via WebRTC data channels (DTLS-encrypted). The relay server never handles file payload bytes.
- **Chunked transfer**: Files are split into 64 KB chunks. Each chunk carries a SHA256 checksum.
- **End-to-end integrity**: The final assembled file is verified against a SHA256 hash of the full file computed on the sender.
- **Receiver consent required**: The receiving party must explicitly approve each incoming file.
- **No auto-save**: Files are staged in a temporary buffer; the receiver must choose the save destination.
- **Max file size: 100 MB** per transfer, configurable down by enterprise policy.

**In Scope:**
- Host → Viewer file transfer.
- Viewer → Host file transfer.
- Single-file transfers (batch transfers are sequenced single-file transfers).

**Out of Scope:**
- Directory sync or recursive folder transfer.
- Streaming media files (use screen share for live content).
- Clipboard-based binary transfer (covered in `threat-model-clipboard.md`).

---

## 2. Assets

| Asset | Description | Sensitivity |
|---|---|---|
| Receiving host filesystem | The directory to which received files are written | Critical |
| File metadata (name, size, MIME) | Sender-supplied metadata, potentially spoofed | High |
| File payload integrity | Actual file bytes in transit | High |
| Transfer consent state | Whether the receiver has approved the transfer | Critical |
| Temporary staging buffer | In-memory / temp-dir buffer holding received chunks | High |
| Audit log | Record of all file transfer events | High |

---

## 3. Threat Actors

### 3.1 Malicious Sender (Viewer or Host)
A session participant who sends a malicious file disguised as benign, or crafts a transfer request designed to exploit filesystem or application vulnerabilities.

**Motivation:** Malware delivery, data exfiltration, system compromise.

### 3.2 External Attacker
An unauthorized party who intercepts or injects into the file transfer data channel.

**Motivation:** Data theft; delivering malware by corrupting a legitimate transfer.

### 3.3 Insider / Rogue Operator
An enterprise user who abuses file transfer to exfiltrate confidential data or deliver unauthorized software to corporate endpoints.

**Motivation:** Data theft; unauthorized software installation.

---

## 4. Threats and Mitigations

### 4.1 Path Traversal Attack

**Description:** A malicious sender constructs a filename containing path traversal sequences (e.g., `../../etc/passwd`, `..\Windows\System32\cmd.exe`) designed to write the received file to a sensitive system location outside the intended destination directory.

**Impact:** Overwrite of critical OS files; planting of malicious executables or configuration files.

**Mitigations:**

1. **Filename sanitizer**: All incoming filenames are passed through a strict sanitizer before use. The sanitizer:
   - Strips all path components (directory separators `/`, `\`, `:` on Windows).
   - Removes null bytes, leading dots (hidden file creation), and Unicode control characters.
   - Normalizes Unicode to NFC form and rejects remaining non-printable characters.
   - Truncates the filename to 255 bytes (filesystem maximum).
2. **Path traversal validator**: After sanitization, the resolved save path is validated to confirm it is a child of the user-selected destination directory using `path.resolve()` comparison. If the resolved path escapes the target directory, the transfer is aborted with an error.
3. **User-controlled save destination**: The receiver selects the save directory via a native OS file picker dialog. The application enforces that the file is saved only within that chosen directory.
4. **Main-process-only file I/O**: All file write operations occur exclusively in the Electron main process. The renderer process handles UI; it cannot directly write to the filesystem. IPC messages requesting file writes are validated by the main process before execution.

---

### 4.2 Malicious File Execution

**Description:** A sender transfers a file containing malware (executable, script, or document with macros) to the receiver. If the receiver opens or auto-executes the file, the malware runs.

**Impact:** Malware infection; ransomware; data exfiltration; privilege escalation.

**Mitigations:**

1. **No auto-open**: RemoteDesk **never automatically opens** received files. The receiver must take an explicit OS action to open the file after saving.
2. **Receiver consent dialog**: Before any file transfer begins, the receiver sees a dialog showing: sender identity, filename (sanitized), file size, and detected MIME type. The receiver must click "Accept" to proceed.
3. **File type restrictions discussion** (see Section 5 below for full analysis).
4. **SHA256 integrity check**: The receiver computes a SHA256 hash of the fully assembled file and compares it against the sender-provided hash. A mismatch aborts the transfer and deletes the temporary buffer. This ensures the file was not tampered with in transit, but does **not** verify that the file is benign.
5. **Chunk-level checksums**: Each 64 KB chunk carries a SHA256 checksum. Corrupted chunks are rejected and re-requested (with a maximum of 3 retries per chunk). This prevents partial-corruption attacks that could produce a valid final hash from a manipulated stream.
6. **OS download guard integration**: On macOS, received files are written with the quarantine extended attribute (`com.apple.quarantine`), triggering Gatekeeper checks when the user opens the file. On Windows, the Zone.Identifier alternate data stream is set to indicate the file came from the internet.

---

### 4.3 Zip Bomb / Archive Bomb

**Description:** A sender transfers a small compressed archive that, when extracted, expands to an enormous amount of data (e.g., 42.zip — a 42 KB file that expands to petabytes). If the application or the receiver's OS decompresses it, the system is overwhelmed.

**Impact:** Disk exhaustion; system crash; denial of service.

**Mitigations:**

1. **No in-application decompression**: RemoteDesk does not decompress, extract, or process the contents of any received file. Files are saved as-is. The zip bomb only detonates if the user manually extracts the archive.
2. **Max file size limit (100 MB)**: The compressed archive itself cannot exceed 100 MB, limiting the scope of any immediate disk impact from the file itself.
3. **Compression ratio warning** (planned): A future enhancement will detect archive MIME types and warn the user: "This file is an archive. Extracting untrusted archives may consume large amounts of disk space. Verify the source before extracting."
4. **No recursive processing**: Even if the application were to add zip extraction in the future, it must implement a decompressed size limit and recursion depth limit before any extraction.

---

### 4.4 Large File Denial of Service

**Description:** A sender initiates a transfer of a very large file (close to or exceeding the 100 MB limit) to monopolize the WebRTC data channel, starving other session traffic (screen share, input events).

**Impact:** Session degradation; connection drop; host becomes unresponsive.

**Mitigations:**

1. **Hard size limit (100 MB)**: Transfers exceeding 100 MB are rejected at the sender side before transmission begins. The receiver also validates the declared file size before accepting.
2. **Bandwidth throttling**: The file transfer data channel is given a lower QoS priority than the screen share and input event channels. The WebRTC transport layer is configured with bandwidth hints to prevent file transfer from starving other channels.
3. **Transfer cancellation**: Both sender and receiver can cancel an in-progress transfer at any time. Cancellation cleans up the temporary buffer immediately.
4. **Concurrent transfer limit**: A maximum of 1 in-progress file transfer per session is enforced. Additional transfer requests are queued and require a separate consent step.
5. **Enterprise size policy**: The `maxFileSize` enterprise policy allows organizations to set a lower limit (e.g., 10 MB) than the application default.

---

### 4.5 Spoofed File Metadata

**Description:** A malicious sender provides false metadata — particularly a spoofed filename or MIME type — to mislead the receiver about the nature of the file being transferred.

**Impact:** Receiver accepts a file believing it is benign when it is actually an executable or malicious document.

**Attack Scenarios:**
- Sender names a `.exe` file `report.pdf` and sets the MIME type to `application/pdf`.
- Sender names a `.js` script `image.jpg` and sends it.

**Mitigations:**

1. **MIME sniffing after receipt**: After the file is fully assembled, the application performs MIME type detection based on the file's **magic bytes** (file signature), not the sender-provided MIME type. If the detected MIME type differs materially from the declared type, a warning is presented to the receiver.
2. **Extension extraction from sanitized filename**: The file extension from the sanitized filename is displayed prominently in the consent dialog. The receiver sees both the declared MIME type and the file extension, making spoofing more apparent.
3. **Dangerous extension warning**: A static list of high-risk extensions (`.exe`, `.msi`, `.bat`, `.cmd`, `.ps1`, `.vbs`, `.js`, `.jar`, `.dmg`, `.pkg`, `.sh`, `.deb`, `.rpm`, `.dll`, `.so`) triggers an additional warning in the consent dialog: "⚠️ This file type can execute code on your system. Only accept from trusted sources."

---

### 4.6 MIME Sniffing Attacks

**Description:** A sender crafts a file with a benign MIME type header but a malicious payload — exploiting MIME sniffing in browsers or OS previewers that ignore the declared type and execute based on content.

**Impact:** Code execution; XSS if file is previewed in a browser context.

**Mitigations:**

1. **No in-app preview**: RemoteDesk does not render or preview received files within the application. There is no in-app browser context that could execute MIME-sniffed content.
2. **Magic byte detection**: As noted in §4.5, magic byte-based MIME detection is performed after assembly. Discrepancies trigger warnings.
3. **OS quarantine flags**: Quarantine attributes (macOS) and Zone.Identifier (Windows) ensure the OS applies appropriate security policies when the user opens the file externally.

---

### 4.7 Receiving Files Without Consent

**Description:** A sender initiates a file transfer that begins writing to the receiver's filesystem before the receiver has had an opportunity to consent.

**Impact:** Unwanted files written to filesystem; potential for subsequent attacks using the written file.

**Mitigations:**

1. **Pre-transfer consent gate**: When a file transfer is initiated, the receiver's application displays a consent dialog **before** any file bytes are accepted from the data channel. The sender is informed to wait; the data channel is paused at the protocol level until consent is granted.
2. **Transfer request timeout**: If the receiver does not respond to the consent dialog within 60 seconds, the transfer request is automatically declined.
3. **No write before full consent**: No bytes are written to disk (or even to the staging temp buffer on disk) until the receiver clicks "Accept." In-memory chunk buffering only begins after consent.
4. **Explicit save action**: Even after accepting the transfer, the file is staged in memory. The receiver must choose a save location via file picker. Only then is any data written to the non-temporary filesystem.

---

### 4.8 In-Transit Tampering

**Description:** A man-in-the-middle attacker (or a compromised relay server) modifies file bytes in transit.

**Impact:** Receiver receives a modified file (potentially malicious) while believing it is the original.

**Mitigations:**

1. **DTLS 1.3 encryption**: The WebRTC data channel uses DTLS 1.3 with ECDHE key exchange. Data in transit is authenticated and encrypted. Modification would be detected by the DTLS MAC.
2. **SHA256 chunk checksums**: Even in the unlikely event of DTLS MAC bypass, each 64 KB chunk has an independent SHA256 checksum. Any byte modification in a chunk causes checksum failure and chunk rejection.
3. **SHA256 full-file integrity check**: The final assembled file hash must match the sender-computed hash transmitted before transfer initiation. A mismatch causes the transfer to be aborted and the temp file deleted.
4. **No relay server file routing**: File bytes never pass through the relay server; only WebRTC signaling (SDP, ICE) passes through it. This eliminates server-side tampering as a practical attack vector.

---

## 5. File Type Restrictions Discussion

RemoteDesk takes a **warning-based approach** to file type restrictions rather than a hard blocklist. This is a deliberate design choice:

**Arguments for a hard blocklist:**
- Prevents accidental execution of dangerous file types.
- Reduces liability for malware delivery.

**Arguments against a hard blocklist (current stance):**
- Legitimate enterprise use cases require transferring executables (e.g., IT deploying installers).
- A blocklist creates a false sense of security (attackers rename extensions).
- MIME sniffing after receipt already detects true file types regardless of extension.
- OS-level security (Gatekeeper, SmartScreen, AV) is more effective at execution-time.

**Current approach:**
- Dangerous extension list triggers a **heightened warning** in the consent dialog (not a block).
- Enterprise policy `allowedExtensions: [".pdf", ".docx", ...]` allows organizations to enforce an allowlist. If set, any file not in the allowlist is blocked.
- Enterprise policy `blockedExtensions: [".exe", ".msi", ...]` is also available for organizations that prefer a denylist.

**Recommendation for high-security deployments:** Enable `allowedExtensions` policy with a narrow allowlist.

---

## 6. Residual Risks

| Risk | Likelihood | Impact | Accepted? | Notes |
|---|---|---|---|---|
| Receiver opens received malware manually | High | Critical | Partial | Cannot prevent post-save OS actions. Quarantine attributes and AV scanning (external) are the mitigations. |
| Zero-day in DTLS implementation | Low | Critical | Yes | Dependent on browser/Electron WebRTC stack. Mitigated by chunk checksums as defense-in-depth. |
| Receiver deceived by spoofed filename | Medium | High | Partial | MIME sniffing + extension display + dangerous extension warning reduce likelihood. Social engineering cannot be fully prevented. |
| Large file transfer disrupts session | Medium | Medium | Partial | QoS prioritization mitigates but does not eliminate bandwidth contention on constrained links. |
| Enterprise policy bypass by determined insider | Low | High | Partial | Policy enforcement is in main process; a debugger-attached attacker could bypass it. Full prevention requires OS-level policy enforcement. |

---

## 7. Security Controls Summary

| Control | Layer | Mandatory? |
|---|---|---|
| Filename sanitizer (strip traversal, null bytes, controls) | Main process | ✅ Yes |
| Path traversal validator (resolved path check) | Main process | ✅ Yes |
| Max file size 100 MB | Data channel handler | ✅ Yes |
| Receiver consent dialog (pre-transfer gate) | UI layer | ✅ Yes |
| 60s consent timeout | Session state machine | ✅ Yes |
| Main-process-only file I/O | Architecture | ✅ Yes |
| No auto-save (save via file picker) | UI layer | ✅ Yes |
| SHA256 full-file integrity check | Receiver pipeline | ✅ Yes |
| SHA256 chunk-level checksums | Data channel protocol | ✅ Yes |
| Magic byte MIME detection (post-receipt) | Receiver pipeline | ✅ Yes |
| Dangerous extension warning | UI consent dialog | ✅ Yes |
| OS quarantine/Zone.Identifier flags | Main process file write | ✅ Yes |
| DTLS 1.3 encryption | WebRTC layer | ✅ Yes |
| No relay server file routing | Architecture | ✅ Yes |
| Bandwidth throttling (QoS) | WebRTC data channel config | ✅ Yes |
| `allowedExtensions` enterprise policy | Enterprise policy API | Optional |
| `blockedExtensions` enterprise policy | Enterprise policy API | Optional |
| `maxFileSize` enterprise policy | Enterprise policy API | Optional |

---

## 8. References

- `docs/security/consent-model.md` — Consent lifecycle for file transfer
- `docs/security/audit-logging-model.md` — AuditEvent schema for file transfers
- `docs/security/enterprise-policy.md` — Policy controls for file transfer
- RFC 8831 (WebRTC Data Channels)
- OWASP File Upload Cheat Sheet
- CWE-22: Improper Limitation of a Pathname to a Restricted Directory (Path Traversal)
- CWE-434: Unrestricted Upload of File with Dangerous Type

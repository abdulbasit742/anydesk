# Mobile Remote Control Threat Model

## Assets
- Session tokens, device credentials, screen content, clipboard.

## Threats
1. **MITM on public WiFi** -> TLS + cert pinning.
2. **Shoulder surfing** -> biometric gate + auto-lock.
3. **Malicious host app** -> app attestation + store review.
4. **Clipboard leakage** -> disable clipboard sync by default.
5. **Deep link hijacking** -> verify URL scheme + path.

## Mitigations
- Rate limit connect attempts.
- Require password for unknown devices.
- Audit all session starts.

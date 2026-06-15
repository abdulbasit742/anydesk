# File Transfer Security

## Threat Model

1. **Malicious file upload** - Executable disguised as document
2. **Path traversal** - Filename manipulation
3. **Data exfiltration** - Unauthorized file download
4. **DoS** - Extremely large file transfer

## Controls

- Incoming file consent required
- Filename sanitized (special chars removed)
- Max file size: 2GB
- Chunk-level integrity checking
- Transfer cancellation by either party
- Audit logging of all transfers

## Filename Sanitization

```
input: "../../../etc/passwd"
output: "_._._.etc_passwd"
```

## Max File Sizes by Plan

| Plan | Max File Size |
|------|---------------|
| Free | 100MB |
| Pro | 500MB |
| Business | 2GB |
| Enterprise | Unlimited |

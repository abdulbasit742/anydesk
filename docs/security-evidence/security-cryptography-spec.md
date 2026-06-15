# RemoteDesk Cryptography Specification

## In Transit
| Protocol | Algorithm | Key Length |
|----------|-----------|------------|
| HTTPS | TLS 1.3 | 256-bit |
| WebRTC | DTLS 1.2 | ECDSA P-256 |
| Media | SRTP | AES-128-GCM |
| TURN | TLS (optional) | 256-bit |

## At Rest
| Data | Algorithm | Key Length |
|------|-----------|------------|
| Database | AES-256-GCM | 256-bit |
| Backups | AES-256-GCM | 256-bit |
| Audit Logs | AES-256-GCM | 256-bit |

## Key Management
- Keys stored in AWS KMS / Azure Key Vault
- Key rotation quarterly
- HSM for signing keys
- No keys in source code

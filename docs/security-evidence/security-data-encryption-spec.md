# Data Encryption Specification

## At Rest
- Algorithm: AES-256-GCM
- Key management: AWS KMS
- Rotation: Annual

## In Transit
- Protocol: TLS 1.3
- Certificate: ECDSA P-256
- HSTS: Enabled

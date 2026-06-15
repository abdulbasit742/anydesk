# Compliance Evidence Retention Policy

| Framework | Evidence Type | Retention | Location |
|-----------|--------------|-----------|----------|
| SOC 2 | Control evidence | 1 year after report | S3 |
| SOC 2 | Audit reports | 7 years | Glacier |
| ISO 27001 | Internal audit | 3 years | S3 |
| ISO 27001 | Risk assessments | 3 years | S3 |
| GDPR | DPIAs | Duration of processing + 3 years | S3 |
| GDPR | Consent records | Duration of processing + 3 years | S3 |
| PCI (if applicable) | Scan reports | 1 year | Glacier |

Access: Compliance team + external auditors
Encryption: AES-256 at rest

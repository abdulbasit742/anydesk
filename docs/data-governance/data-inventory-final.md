# RemoteDesk Data Inventory (Final)

## Data Categories

### User Data
| Field | Type | Purpose | Source | Retention |
|-------|------|---------|--------|-----------|
| email | PII | Authentication | User input | Account lifetime + 30d |
| name | PII | Display | User input | Account lifetime + 30d |
| password_hash | Sensitive | Authentication | Derived | Account lifetime |
| desk_id | Pseudonym | Session routing | Generated | Account lifetime |
| role | System | Authorization | Admin/System | Account lifetime |
| mfa_secret | Sensitive | 2FA | Generated | Account lifetime |
| avatar_url | PII | Display | User upload | Account lifetime |

### Session Data
| Field | Type | Purpose | Retention |
|-------|------|---------|-----------|
| session_id | System | Session tracking | 1 year |
| host_desk_id | Pseudonym | Participant | 1 year |
| viewer_desk_id | Pseudonym | Participant | 1 year |
| start_time | System | Duration calc | 1 year |
| end_time | System | Duration calc | 1 year |
| bytes_transferred | System | Billing/Analytics | 90 days |
| recording_path | Sensitive | Compliance | 90 days |

### Device Data
| Field | Type | Purpose | Retention |
|-------|------|---------|-----------|
| device_id | System | Identification | Account lifetime |
| user_agent | System | Compatibility | Account lifetime |
| os_info | System | Support | Account lifetime |
| ip_address | PII | Security/Audit | 90 days (anonymized) |
| trust_status | System | Authorization | Account lifetime |

### Audit Data
| Field | Type | Purpose | Retention |
|-------|------|---------|-----------|
| action | System | Compliance | 7 years |
| actor_id | Pseudonym | Accountability | 7 years |
| resource_type | System | Classification | 7 years |
| resource_id | System | Reference | 7 years |
| timestamp | System | Chronology | 7 years |
| ip_address | PII | Security | 7 years (hashed) |
| outcome | System | Result | 7 years |

### File Data
| Field | Type | Purpose | Retention |
|-------|------|---------|-----------|
| file_name | PII | Identification | 30 days |
| file_size | System | Quota | 30 days |
| file_path | Sensitive | Storage | 30 days |
| checksum | System | Integrity | 30 days |
| sender_id | Pseudonym | Accountability | 30 days |
| recipient_id | Pseudonym | Accountability | 30 days |

## Data Flow
```
User Input -> Validation -> Processing -> Storage -> Archive/Delete
                |              |            |
                v              v            v
             Logs        Analytics      Backup
```

## Data Sharing
| Recipient | Data | Purpose | Legal Basis |
|-----------|------|---------|-------------|
| AWS | All | Hosting | Contract |
| Stripe | Payment info | Billing | Contract |
| SendGrid | Email | Communication | Contract |
| None | User data | Sale | N/A |

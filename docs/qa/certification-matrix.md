# Certification Matrix

## Requirements Traceability

### Functional Requirements
| Req | Test Case | Status |
|-----|-----------|--------|
| FR-001 User registration | auth-flow.spec.ts | PASS |
| FR-002 User login | auth-flow.spec.ts | PASS |
| FR-003 Device registration | dashboard.spec.ts | PASS |
| FR-004 Session establishment | socket-signaling.test.ts | PASS |
| FR-005 Screen sharing | webrtc-mocked.test.ts | PASS |
| FR-006 Remote control | input-normalization.test.ts | PASS |
| FR-007 File transfer | file-transfer-reducer.test.ts | PASS |
| FR-008 Chat | chat-reducer.test.ts | PASS |
| FR-009 Clipboard sync | clipboard-sync.test.ts | PASS |
| FR-010 Billing | billing/*.test.ts | PASS |

### Non-Functional Requirements
| Req | Test Case | Status |
|-----|-----------|--------|
| NFR-001 Response time < 500ms | api-load-test.ts | PASS |
| NFR-002 99.9% uptime | healthcheck.sh | PASS |
| NFR-003 P2P encryption | security tests | PASS |
| NFR-004 Rate limiting | rate-limit.test.ts | PASS |
| NFR-005 RBAC | rbac.test.ts | PASS |
| NFR-006 Audit logging | audit-log.test.ts | PASS |
| NFR-007 Data retention | retention tests | PASS |

### Compliance Requirements
| Req | Evidence | Status |
|-----|----------|--------|
| SOC-2 Security | security-evidence-guide.md | PASS |
| SOC-2 Availability | backup-verification.md | PASS |
| ISO 27001 A.9 | rbac.test.ts | PASS |
| ISO 27001 A.12 | backup.sh | PASS |
| GDPR Access | data-export-procedure.md | PASS |
| GDPR Deletion | data-deletion-procedure.md | PASS |

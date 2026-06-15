# Module Ownership

## Core Team
| Module | Owner | Backup |
|--------|-------|--------|
| WebRTC/Connection | @webrtc-team | @platform-team |
| Screen Capture | @desktop-team | @webrtc-team |
| Remote Input | @desktop-team | @security-team |
| File Transfer | @platform-team | @desktop-team |
| Clipboard | @platform-team | @desktop-team |
| Auth & Sessions | @security-team | @platform-team |
| Billing | @platform-team | @product-team |
| Admin Dashboard | @web-team | @platform-team |
| Desktop App | @desktop-team | @web-team |
| Web App | @web-team | @desktop-team |
| Documentation | @docs-team | @product-team |

## Code Review Requirements
- **Core modules**: 2 approvals from module owners
- **Security modules**: Must include @security-team
- **API changes**: Must include @api-reviewers
- **UI changes**: Must include @design-reviewers

## Review Checklist
- [ ] Module owner approval
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or flagged)
- [ ] Security review if applicable

## Emergency Contacts
- Security incidents: security@remotedesk.io
- Production issues: oncall@remotedesk.io
- General questions: dev@remotedesk.io

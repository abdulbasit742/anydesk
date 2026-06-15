# Audit Log Retention Policy

Recommended defaults:

- Security-critical audit events: retain for 365 days.
- File transfer metadata: retain for 180 days, never store file contents.
- Clipboard events: retain metadata only, never clipboard values.
- Remote input events: retain permission and blocked-event metadata only.

Exports should be permission-gated behind `audit.read`.

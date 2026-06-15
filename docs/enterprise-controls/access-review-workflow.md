# RemoteDesk Access Review Workflow

## Overview
Quarterly access reviews ensure users have appropriate permissions.

## Workflow Steps
1. **Initiation** - Admin triggers review cycle
2. **Self-Review** - Users review their own access
3. **Manager Review** - Managers review team access
4. **Security Review** - Security team audits exceptions
5. **Remediation** - Revoke unnecessary access
6. **Certification** - Export compliance report

## Review Schedule
| Review Type | Frequency | Owner |
|-------------|-----------|-------|
| User Access | Quarterly | Team Lead |
| Admin Access | Monthly | Security |
| Device Access | Quarterly | IT Admin |
| Partner Access | Quarterly | Partner Ops |

## Automated Checks
- Flag users with no activity in 90 days
- Flag orphaned accounts (no manager)
- Flag excessive permissions (>5 roles)
- Flag direct assignments (bypassing groups)

## Remediation Actions
- Revoke: Remove access immediately
- Downgrade: Reduce permission level
- Reassign: Transfer to correct user
- Document: Record business justification

## Evidence Collection
All review actions are logged with:
- Reviewer identity
- Timestamp
- Decision rationale
- Before/after state

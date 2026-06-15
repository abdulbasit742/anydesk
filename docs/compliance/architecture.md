# Compliance Architecture

## Components
- **Audit Service**: Centralized event logging
- **Retention Service**: Automatic data cleanup
- **GDPR Service**: Export, deletion, consent
- **Policy Enforcer**: Org-level policy enforcement

## Data Flow
1. Action occurs (login, session, etc.)
2. Audit event emitted
3. Retention period calculated from catalog
4. Expiration date set
5. Cleanup job removes expired records

## Privacy by Design
- Data minimization: Only collect what's needed
- Purpose limitation: Data used only for stated purposes
- Storage limitation: Automatic retention enforcement
- Security: Encryption at rest and in transit

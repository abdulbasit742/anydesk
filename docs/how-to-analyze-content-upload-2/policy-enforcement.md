# Enterprise Policy Enforcement for RemoteDesk

This document outlines the mechanisms for enforcing enterprise-level policies within the RemoteDesk application, ensuring compliance, security, and consistent operational behavior across an organization.

## Overview
RemoteDesk provides robust policy enforcement capabilities, allowing administrators to define and apply rules governing various aspects of remote sessions, user behavior, and device interactions. These policies are crucial for meeting corporate governance, security, and compliance requirements.

## Key Policy Areas

### 1. Clipboard Policy Enforcement
- **Purpose**: Controls the flow of data via the clipboard during remote sessions.
- **Details**: Policies can dictate whether clipboard transfer is allowed at all, restrict it to specific directions (e.g., host to viewer only), or set size limits for transferred content. This prevents unauthorized data exfiltration or accidental data leakage.
- **Related Files**: `policy.types.ts` (ClipboardTransferSetting), `clipboard-policy-enforcement.ts`

### 2. File Transfer Policy Enforcement
- **Purpose**: Governs the transfer of files between host and viewer machines.
- **Details**: Administrators can enable/disable file transfers, specify allowed transfer directions, set maximum file sizes, and even restrict transfers to certain file types (e.g., only allow `.pdf` or `.docx`).
- **Related Files**: `policy.types.ts` (FileTransferSetting), `file-transfer-policy-enforcement.ts`

### 3. Input Control Policy Enforcement
- **Purpose**: Manages the ability of the remote viewer to control the host machine's keyboard and mouse.
- **Details**: Policies can enable or disable keyboard and mouse input independently. This is useful for scenarios where a viewer should only observe, or where specific input methods are restricted for security reasons.
- **Related Files**: `policy.types.ts` (InputControlSetting), `input-control-policy-enforcement.ts`

### 4. Max Session Duration Enforcement
- **Purpose**: Limits the maximum allowed duration of a single remote session.
- **Details**: Policies can define a maximum number of minutes a session can remain active. When this limit is reached, the system can either warn the user or automatically disconnect the session. This helps prevent unauthorized prolonged access and ensures resource management.
- **Related Files**: `policy.types.ts` (MaxSessionDurationSetting), `max-session-duration-enforcement.ts`

### 5. Policy Evaluator
- **Purpose**: The core logic responsible for evaluating defined policies against specific actions or contexts.
- **Details**: Takes a set of policies and a context (user, device, session, organization) and determines whether a requested action is permitted. It handles policy precedence (e.g., more specific policies override general ones) and returns a clear decision with a reason.
- **Related File**: `policy-evaluator.ts`

### 6. Policy Audit Events
- **Purpose**: Records all significant policy-related actions and decisions for auditing and compliance.
- **Details**: Every instance of a policy being enforced, a policy violation, or a policy update is logged. These audit events include details about the policy, the affected entity (user, device, session), the outcome, and a timestamp. This provides an immutable record for security reviews.
- **Related File**: `policy-audit-events.ts`

## Policy Definition and Management
- **Centralized Management**: Policies are defined and managed centrally, typically through an admin web interface.
- **Granularity**: Policies can be applied at various levels: organization-wide, per team, per user, or per device, allowing for flexible and fine-grained control.
- **Distribution**: Policies are distributed to relevant client applications (desktop, web) and backend services for enforcement.

## Implementation Considerations
- **Client-Side Enforcement**: For immediate feedback and responsiveness, some policy checks (e.g., clipboard, file transfer) are performed client-side.
- **Server-Side Enforcement**: Critical policies (e.g., max session duration, admin actions) are also enforced server-side to prevent circumvention.
- **Audit Logging**: All policy enforcement decisions and violations must be logged for compliance and security analysis.

## Testing
Refer to `enterprise-policy-enforcement.test.ts` for a comprehensive list of items to verify during testing.

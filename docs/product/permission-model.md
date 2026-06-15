# Permission Model

## Overview
RemoteDesk uses a multi-layer permission system:

## Layers

### 1. Role-Based Access Control (RBAC)
- `superadmin`: Full system access
- `admin`: Organization management
- `support`: Ticket management, user read access
- `user`: Standard user capabilities

### 2. Feature Permissions
Granular permissions per feature:
- `remote_input`: Control remote mouse/keyboard
- `clipboard`: Share clipboard content
- `file_transfer`: Send/receive files
- `unattended_access`: Access without approval

### 3. Organization Policies
Enterprise-level policy enforcement:
- `force_2fa`: Require 2FA for all members
- `disable_clipboard`: Block clipboard sync
- `disable_file_transfer`: Block file transfers
- `restrict_remote_input`: Require approval for input
- `require_recording`: Record all sessions
- `device_allowlist`: Only approved devices

### 4. Session-Level Permissions
Per-session consent:
- Host can accept/reject incoming requests
- Granular permission grants per session
- Auto-reset on disconnect

## Permission Resolution
1. Deny by default
2. Organization policy check
3. User role check
4. Explicit permission check
5. Session-level consent

## Defaults
- All features: `prompt` (ask first time)
- New users: `user` role
- All org policies: `disabled`
- Admin actions require explicit permission

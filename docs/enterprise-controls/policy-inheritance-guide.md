# RemoteDesk Policy Inheritance Guide

## Policy Hierarchy
```
Organization Root Policy
  -> Team Policies (override root)
    -> Group Policies (override team)
      -> User Policies (override group)
```

## Inheritance Rules
1. **Additive**: Child policies can add restrictions
2. **Override**: Explicit child settings replace parent
3. **Lock**: Parent can lock settings (child cannot override)
4. **Default**: Unset values inherit from parent

## Policy Types
| Type | Inherits | Lockable |
|------|----------|----------|
| Remote Input | Yes | Yes |
| Clipboard | Yes | Yes |
| File Transfer | Yes | Yes |
| Recording | Yes | Yes |
| Unattended Access | Yes | Yes |
| Session Timeout | Yes | No |
| IP Whitelist | Yes | No |

## Example: Policy Resolution
```
Root: remote_input = require_approval
Team Sales: remote_input = allow
User Alice: (not set)

Result for Alice in Sales team: allow (team overrides root)
```

## Implementation Notes
- Policy resolution happens at session start
- Cached for 5 minutes
- Changes take effect on next session
- Audit log records policy source

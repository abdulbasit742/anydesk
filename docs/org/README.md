# Organization Management

## Features

### Invites
- 7-day expiry (configurable)
- Reminder emails at 3 and 1 days
- Max 3 resends with 24h cooldown
- Expired invite UI indicator

### Member Removal
- Confirmation dialog with impact summary
- Active session count displayed
- Requires explicit confirmation checkbox

### Owner Transfer
- 6-digit verification code
- 60-minute timeout
- Must verify code to complete

### Role Protection
- Cannot downgrade last owner
- Cannot remove last admin
- Hierarchy enforcement

## Pages
- /org/members - Member list
- /org/invites - Invitation management
- /org/security - Security settings
- /org/settings - Organization config

## Events
- org:member-added
- org:member-removed
- org:role-changed
- org:invite-sent
- org:owner-transferred

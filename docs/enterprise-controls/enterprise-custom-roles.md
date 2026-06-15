# Custom Role Configuration

```json
{
  "role": "support_manager",
  "permissions": [
    "sessions.view",
    "users.view",
    "tickets.manage",
    "reports.view"
  ],
  "restrictions": {
    "max_session_duration": 60,
    "can_view_all_orgs": false
  }
}
```

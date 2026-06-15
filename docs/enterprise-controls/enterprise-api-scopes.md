# Enterprise API Scopes

| Scope | Grants Access To |
|-------|-----------------|
| `users:read` | List and view users |
| `users:write` | Create and modify users |
| `sessions:read` | View session metadata |
| `sessions:manage` | End sessions |
| `devices:read` | List devices |
| `devices:write` | Manage device trust |
| `audit:read` | Read audit logs |
| `policies:manage` | Manage policies |
| `billing:read` | View billing data |
| `webhooks:manage` | Configure webhooks |

OAuth tokens are scoped to organization. Admin tokens include all scopes.

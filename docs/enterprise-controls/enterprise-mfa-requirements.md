# RemoteDesk MFA Requirements

## Enforced MFA Methods
| Method | Enterprise | Compliance |
|--------|:----------:|:----------:|
| TOTP (Auth App) | Required | Required |
| WebAuthn/FIDO2 | Recommended | Required |
| SMS | Not allowed | Not allowed |
| Email OTP | Not allowed | Not allowed |

## MFA Policies
- All admin accounts must have MFA
- Session elevation requires re-auth with MFA
- New device registration requires MFA
- API keys scoped to MFA-required endpoints need MFA session

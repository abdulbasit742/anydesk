# Password Policy

## Defaults
- Min length: 12 characters
- Max length: 128 characters
- Require uppercase, lowercase, numbers, symbols
- Prevent reuse of last 5 passwords
- Account lockout after 5 failures (30 min)

## Organization Policies
Admins can customize policy per organization via Security Center.

## Enforcement
- Applied on password change/reset
- Legacy passwords grandfathered until change
- API validation on all password endpoints

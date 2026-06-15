# SSO and SCIM notes

OIDC config stores issuer, client ID and discovery URL.
Client secrets must be stored through your existing secret manager, not in generated files.
SCIM provisioning events should be idempotent and auditable.

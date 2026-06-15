# RemoteDesk SSO Security Checklist

## Introduction
This checklist provides a set of security considerations and best practices for implementing and maintaining Single Sign-On (SSO) in RemoteDesk. Adhering to these guidelines helps ensure the confidentiality, integrity, and availability of user authentication and authorization processes.

## General SSO Security

- [ ] **Secure Communication:** All communication between RemoteDesk (Service Provider) and the Identity Provider (IdP) must use HTTPS/TLS 1.2 or higher.
- [ ] **Certificate Validation:** Always validate IdP certificates to prevent man-in-the-middle attacks.
- [ ] **Strong Cryptography:** Use strong cryptographic algorithms for signing and encryption of SAML assertions or OIDC tokens (e.g., SHA256 or SHA512 for signatures, AES256 for encryption).
- [ ] **Replay Attack Protection:** Implement and verify mechanisms to prevent replay attacks (e.g., checking `NotBefore` and `NotOnOrAfter` conditions, using unique `ID` attributes).
- [ ] **Auditing and Logging:** Enable comprehensive audit logging for all SSO-related events, including successful and failed logins, configuration changes, and attribute mapping updates.
- [ ] **Time Synchronization:** Ensure all servers involved in the SSO flow have synchronized clocks to prevent issues with timestamp-based validations.

## SAML Specific Security

- [ ] **Assertion Signature Validation:** Always validate the digital signature of incoming SAML assertions using the IdP's public certificate.
- [ ] **Assertion Encryption:** Encrypt SAML assertions, especially if they contain sensitive user attributes.
- [ ] **Audience Restriction:** Configure SAML assertions to include an `AudienceRestriction` element that matches RemoteDesk's entity ID to prevent assertions from being used by other service providers.
- [ ] **Recipient Validation:** Validate the `Recipient` attribute in the SAML assertion to ensure it matches RemoteDesk's Assertion Consumer Service (ACS) URL.
- [ ] **InResponseTo Validation:** For unsolicited responses, ensure the `InResponseTo` attribute is not present or is validated against a stored request ID if present.
- [ ] **NameID Policy:** Configure a `NameIDPolicy` that specifies the desired format and ensures a unique identifier for each user.

## OIDC Specific Security

- [ ] **ID Token Validation:** Validate the signature and claims of the ID Token (e.g., `iss`, `aud`, `exp`, `iat`, `nonce`).
- [ ] **Nonce Validation:** Implement and verify `nonce` validation to mitigate replay attacks.
- [ ] **State Parameter:** Use and validate the `state` parameter in authorization requests to prevent CSRF attacks.
- [ ] **PKCE (Proof Key for Code Exchange):** Implement PKCE for public clients (e.g., mobile apps, SPAs) to prevent authorization code interception attacks.
- [ ] **Client Secret Protection:** Securely store and transmit client secrets. Avoid embedding them in client-side code.
- [ ] **Scope Validation:** Ensure that the requested scopes are appropriate and that the IdP returns only the authorized scopes.

## User Provisioning and Deprovisioning

- [ ] **Just-in-Time (JIT) Provisioning Security:**
    - [ ] Assign least privilege default roles to JIT-provisioned users.
    - [ ] Validate domain ownership if JIT provisioning is based on email domains.
    - [ ] Ensure attribute mapping is secure and prevents privilege escalation.
- [ ] **Deprovisioning:** Implement a robust deprovisioning process (e.g., via SCIM) to automatically deactivate or delete user accounts in RemoteDesk when they are removed from the IdP.
- [ ] **Account Linking:** Securely link existing RemoteDesk accounts to SSO identities, preventing unauthorized account takeovers.

## Configuration Management

- [ ] **Secure Configuration Storage:** Store all SSO configurations (e.g., client secrets, certificates) securely, preferably in a secrets management system.
- [ ] **Access Control to Configuration:** Restrict access to SSO configuration settings to authorized administrators only.
- [ ] **Configuration Review:** Regularly review SSO configurations for any misconfigurations or outdated settings.

## Incident Response

- [ ] **Monitoring and Alerting:** Set up alerts for unusual SSO activity (e.g., high number of failed login attempts, unexpected attribute changes).
- [ ] **Incident Playbook:** Develop and test an incident response playbook for SSO-related security incidents.
- [ ] **Communication Plan:** Have a communication plan in place for notifying users and stakeholders in case of an SSO outage or security breach.

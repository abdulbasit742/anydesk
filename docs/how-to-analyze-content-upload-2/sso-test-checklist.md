# SSO Test Checklist for RemoteDesk

This checklist provides a comprehensive guide for Quality Assurance (QA) testing of Single Sign-On (SSO) integrations with RemoteDesk using SAML and OIDC.

## 1. Domain Verification
- [ ] Verify domain verification process (TXT record) works correctly.
- [ ] Verify domain verification process (CNAME record) works correctly.
- [ ] Verify that SSO configuration is blocked until domain is verified.
- [ ] Verify error handling for incorrect or missing DNS records.

## 2. SAML Integration Testing
- [ ] Verify successful user login via SAML IdP.
- [ ] Verify user provisioning (Just-in-Time) on first SAML login.
- [ ] Verify attribute mapping for user details (e.g., email, first name, last name, roles).
- [ ] Verify that users with invalid or missing attributes are handled gracefully (e.g., error message, default roles).
- [ ] Verify Single Logout (SLO) functionality (if supported by IdP and implemented).
- [ ] Verify error handling for invalid SAML responses or expired assertions.
- [ ] Test with different SAML IdPs (e.g., Okta, Azure AD, OneLogin).
- [ ] Verify re-authentication flow after session expiry.

## 3. OIDC Integration Testing
- [ ] Verify successful user login via OIDC IdP.
- [ ] Verify user provisioning (Just-in-Time) on first OIDC login.
- [ ] Verify attribute mapping for user details (e.g., email, first name, last name, roles) from ID Token and UserInfo endpoint.
- [ ] Verify that users with invalid or missing claims are handled gracefully.
- [ ] Verify logout functionality (redirection to IdP logout endpoint).
- [ ] Verify error handling for invalid tokens, expired sessions, or incorrect client configurations.
- [ ] Test with different OIDC IdPs (e.g., Google, Azure AD, Auth0).
- [ ] Verify re-authentication flow after session expiry.

## 4. User Management and Roles
- [ ] Verify that automatically provisioned users are assigned correct default roles.
- [ ] Verify that existing users can log in via SSO without creating duplicate accounts.
- [ ] Verify that user updates (e.g., role changes) from IdP are reflected in RemoteDesk (if SCIM or similar is integrated).
- [ ] Verify that disabling a user in the IdP prevents them from logging into RemoteDesk.

## 5. Security and Edge Cases
- [ ] Verify all SSO communication occurs over HTTPS.
- [ ] Verify secure storage and handling of client secrets and certificates.
- [ ] Test concurrent logins from different devices/browsers.
- [ ] Test session timeout and re-authentication behavior.
- [ ] Verify that direct login (non-SSO) is disabled for domains configured with mandatory SSO.
- [ ] Verify that SSO bypass mechanisms (if any, for emergencies) are secure and audit-logged.
- [ ] Test scenarios where IdP is temporarily unavailable.

## 6. Admin Experience
- [ ] Verify that SSO settings can be configured and updated in the admin panel.
- [ ] Verify clear feedback is provided for successful and failed SSO configurations.
- [ ] Verify that audit logs record SSO-related events (e.g., successful login, failed login, configuration changes).

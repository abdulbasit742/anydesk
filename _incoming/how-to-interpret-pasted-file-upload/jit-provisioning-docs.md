# RemoteDesk Just-in-Time (JIT) Provisioning Documentation

## Introduction
Just-in-Time (JIT) provisioning allows for the automatic creation of user accounts in RemoteDesk the first time a user logs in via Single Sign-On (SSO). This streamlines user onboarding by eliminating the need for manual account creation, ensuring that users have immediate access upon successful authentication through their Identity Provider (IdP).

## How JIT Provisioning Works

1.  **User Initiates SSO Login:** A user attempts to log in to RemoteDesk using an SSO provider (SAML or OIDC).
2.  **IdP Authentication:** The user is redirected to their IdP for authentication. Upon successful authentication, the IdP sends an assertion (SAML) or an ID Token (OIDC) back to RemoteDesk.
3.  **Attribute Extraction:** RemoteDesk extracts user attributes (e.g., email, first name, last name, groups) from the IdP's assertion/token.
4.  **User Lookup:** RemoteDesk checks its user directory to see if a user with the extracted unique identifier (typically email address) already exists.
5.  **Account Creation (JIT):**
    -   If no existing user is found, RemoteDesk automatically creates a new user account using the attributes provided by the IdP.
    -   Default roles and permissions can be assigned to newly provisioned users based on pre-configured rules or group memberships from the IdP.
6.  **User Login:** The newly created or existing user is logged into RemoteDesk.

## Configuration Requirements

### 1. Enable JIT Provisioning
JIT provisioning must be explicitly enabled in the RemoteDesk SSO settings for each configured SAML or OIDC provider.

### 2. Attribute Mapping
Accurate mapping of attributes from the IdP to RemoteDesk user fields is crucial. Common attributes include:
-   `email` (mandatory, used as unique identifier)
-   `firstName`
-   `lastName`
-   `groups` (for role assignment)

### 3. Default Roles and Permissions
Define default roles and permissions for users provisioned via JIT. This can be a global default or conditional based on IdP-provided group memberships.

### 4. Domain Verification
For security, JIT provisioning often requires domain verification. This ensures that only users from verified organizational domains can be automatically provisioned.

## Security Considerations

-   **Unique Identifiers:** Ensure the IdP sends a stable and unique identifier (e.g., email address) for each user to prevent duplicate accounts or account hijacking.
-   **Attribute Trust:** Only trust attributes from a verified and secure IdP. Validate the integrity of SAML assertions or OIDC tokens.
-   **Default Permissions:** Assign the least privileged default roles to JIT-provisioned users and rely on group mappings for elevated access.
-   **Audit Logs:** All JIT provisioning events (user creation, attribute updates) must be thoroughly audit logged.
-   **Deprovisioning:** JIT provisioning does not automatically handle deprovisioning. Implement SCIM or a similar mechanism for automated user deactivation/deletion when users leave the organization.

## Troubleshooting

-   **User Not Provisioned:** Check IdP logs for successful authentication and attribute release. Verify attribute mapping in RemoteDesk.
-   **Incorrect Permissions:** Review default role assignments and group mappings.
-   **Domain Mismatch:** Ensure the user's email domain is verified in RemoteDesk if domain verification is enabled.

## Best Practices

-   **Test Thoroughly:** Test JIT provisioning with a small group of users before rolling out to the entire organization.
-   **Monitor Logs:** Regularly monitor authentication and provisioning logs for any errors or anomalies.
-   **Combine with SCIM:** For a complete identity lifecycle management solution, combine JIT provisioning (for onboarding) with SCIM (for ongoing updates and deprovisioning).

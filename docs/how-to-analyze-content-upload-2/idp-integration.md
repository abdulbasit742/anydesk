# RemoteDesk Identity Provider (IdP) Integration

This document describes the functionality and implementation of Identity Provider (IdP) integration within RemoteDesk, enabling seamless user authentication and provisioning through enterprise identity systems like Azure AD and Okta.

## Overview
IdP integration extends RemoteDesk's existing SSO capabilities by allowing organizations to connect their corporate identity providers. This facilitates centralized user management, enhances security through established IdP policies, and simplifies the user experience by enabling single sign-on with existing enterprise credentials. It also supports automated user provisioning and de-provisioning via SCIM.

## Features
- **SAML-based SSO**: Support for Security Assertion Markup Language (SAML) for secure authentication flows.
- **SCIM User Provisioning**: Automated creation, updating, and deletion of user accounts in RemoteDesk based on changes in the IdP (System for Cross-domain Identity Management).
- **Just-In-Time (JIT) Provisioning**: Automatically creates user accounts in RemoteDesk upon their first successful login via the IdP.
- **Multiple IdP Support**: Designed to integrate with various IdPs, including Azure AD, Okta, OneLogin, and generic SAML providers.
- **Configurable Settings**: Administrators can configure IdP-specific settings, SAML metadata, and SCIM endpoints.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`IdpProviderType`**: An enum defining supported IdP types (Azure AD, Okta, OneLogin, Generic SAML).
- **`ScimVersion`**: An enum for SCIM protocol versions (1.1, 2.0).
- **`IdpConfig`**: Describes the configuration for an IdP integration, including `organizationId`, `providerType`, `name`, `enabled` status, SAML-specific URLs/certs, SCIM settings (`scimEnabled`, `scimApiEndpoint`, `scimBearerToken`), and JIT provisioning settings (`jitProvisioningEnabled`, `defaultRoles`).
- **`IdpUserProvisioningEvent`**: Represents an event from an IdP for user provisioning (created, updated, deleted), including `idpConfigId`, `idpUserId`, `userName`, `userEmail`, and `details`.
- **Location**: `remotedesk/packages/shared/src/enterprise/idp-integration.dto.ts`

### API Service Logic
- **`IdpIntegrationService.ts`**: Manages IdP configurations and handles SCIM provisioning events on the API server.
  - **Configuration Management**: Stores and retrieves `IdpConfig` settings for different organizations.
  - **SCIM Event Handling**: Processes `IdpUserProvisioningEvent`s to create, update, or delete users in RemoteDesk based on SCIM payloads received from the IdP.
  - **SAML Protocol Handling**: (Conceptual) Includes methods for validating SAML requests and generating SAML responses, which would interact with a SAML library.
  - **JIT Provisioning Logic**: Integrates with user creation flows to provision users automatically on first login if `jitProvisioningEnabled`.
- **Location**: `remotedesk/apps/api/src/enterprise/IdpIntegrationService.ts`

## Usage

### Configuration
1. **Enable IdP Integration**: In the RemoteDesk admin panel, enable the IdP integration for an organization.
2. **Select Provider Type**: Choose the specific IdP (e.g., Azure AD, Okta).
3. **Configure SAML**: Provide the necessary SAML metadata URL, certificates, and endpoints as required by the IdP.
4. **Configure SCIM (Optional)**: If automated user provisioning is desired, enable SCIM, provide the SCIM API endpoint, and a bearer token.
5. **Configure JIT Provisioning**: Enable Just-In-Time provisioning and specify default roles for newly provisioned users.

### User Authentication Flow (SAML)
1. A user attempts to log in to RemoteDesk via the organization's IdP-initiated SSO flow or a service provider-initiated flow.
2. The IdP sends a SAML assertion to RemoteDesk.
3. `IdpIntegrationService` validates the SAML assertion.
4. If valid, the user is authenticated. If JIT provisioning is enabled and the user doesn't exist, an account is created.

### User Provisioning Flow (SCIM)
1. An administrator makes a change to a user in the IdP (e.g., creates a new user, updates user attributes, deactivates a user).
2. The IdP sends a SCIM provisioning request to the RemoteDesk SCIM endpoint.
3. `IdpIntegrationService` receives and processes the `IdpUserProvisioningEvent`.
4. RemoteDesk's user directory is updated accordingly (user created, updated, or deleted).

## Technical Considerations
- **Security**: Secure storage of API keys, bearer tokens, and SAML certificates. All communication must be over HTTPS.
- **SAML Library**: Integration with a robust SAML 2.0 library for parsing, validating, and generating SAML assertions.
- **SCIM Compliance**: Ensuring the SCIM implementation adheres to the SCIM 2.0 specification for interoperability.
- **Attribute Mapping**: Flexible mapping of user attributes from the IdP to RemoteDesk user profiles.
- **Error Handling & Logging**: Comprehensive logging of provisioning events and errors for troubleshooting.
- **User Experience**: Clear guidance for administrators during setup and for users during SSO login.

## Future Enhancements
- **Group Provisioning**: Support for provisioning and synchronizing user groups from the IdP.
- **Role Mapping**: Dynamic mapping of IdP roles/groups to RemoteDesk roles.
- **Advanced JIT Rules**: More sophisticated rules for JIT provisioning, such as requiring specific IdP attributes.
- **IdP-Initiated Logout**: Support for single logout (SLO) initiated from the IdP.

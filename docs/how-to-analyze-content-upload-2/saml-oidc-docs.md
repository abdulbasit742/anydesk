# SAML/OIDC Documentation for RemoteDesk SSO

This document provides an overview and configuration guide for integrating Single Sign-On (SSO) with RemoteDesk using SAML 2.0 and OpenID Connect (OIDC).

## Overview
RemoteDesk supports enterprise-grade SSO to allow users to authenticate using their existing identity providers (IdPs). This streamlines user access, enhances security, and simplifies user management for organizations.

## Supported Protocols

### 1. SAML 2.0 (Security Assertion Markup Language)
- **Purpose**: An XML-based standard for exchanging authentication and authorization data between an identity provider (IdP) and a service provider (SP).
- **Use Case**: Common in enterprise environments for federated identity management.

### 2. OpenID Connect (OIDC)
- **Purpose**: A simple identity layer on top of the OAuth 2.0 protocol. It allows clients to verify the identity of the end-user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end-user in an interoperable and REST-like manner.
- **Use Case**: Popular for modern web and mobile applications, often used with providers like Google, Microsoft Azure AD, Okta, Auth0.

## Configuration Steps (General)

### 1. Domain Verification
Before configuring SSO, organizations must verify ownership of their domain(s) within RemoteDesk. This ensures that only authorized entities can configure SSO for a given domain.
- **Method**: Typically involves adding a TXT or CNAME record to the domain's DNS settings.
- **Reference**: See `domain-verification.dto.ts` and `DomainVerificationUI.tsx`.

### 2. Identity Provider (IdP) Configuration
Administrators will need to configure RemoteDesk as a Service Provider (SP) within their chosen IdP.

#### For SAML 2.0:
- **RemoteDesk SP Metadata**: RemoteDesk will provide its Service Provider (SP) metadata XML, which includes the Assertion Consumer Service (ACS) URL and SP Entity ID.
- **IdP Metadata**: Administrators will provide RemoteDesk with their IdP metadata XML (or manual configuration details like IdP SSO URL and IdP Certificate).
- **Attribute Mapping**: Configure attribute mapping to ensure user information (e.g., email, first name, last name, roles) is correctly passed from the IdP to RemoteDesk.

#### For OpenID Connect:
- **Client ID & Secret**: RemoteDesk will be registered as a client application with the OIDC provider, obtaining a Client ID and Client Secret.
- **Redirect URI**: The Redirect URI (or Callback URL) for RemoteDesk must be registered with the IdP (e.g., `https://app.remotedesk.com/auth/oidc/callback`).
- **Discovery Endpoint**: RemoteDesk can often auto-configure using the IdP's OIDC discovery endpoint.
- **Attribute Mapping**: Map claims from the IdP's ID Token or UserInfo endpoint to RemoteDesk user attributes.

### 3. RemoteDesk SSO Settings
Within the RemoteDesk admin dashboard, administrators will configure the SSO provider settings.
- **Enable/Disable**: Toggle SSO for the organization or specific teams.
- **Protocol Selection**: Choose between SAML or OIDC.
- **Provider Details**: Enter the necessary IdP-specific configuration (e.g., metadata URL, certificates, client secrets).
- **User Provisioning**: Configure whether new users authenticating via SSO should be automatically provisioned in RemoteDesk.
- **Default Roles**: Assign default roles to newly provisioned users.
- **Reference**: See `sso-provider-settings.dto.ts`.

## User Experience
- **Login Flow**: Users will be redirected to their organization's IdP for authentication when attempting to log in to RemoteDesk.
- **Just-in-Time Provisioning**: If enabled, users will have their RemoteDesk accounts created automatically upon their first successful SSO login.

## Security Considerations
- **HTTPS Everywhere**: All SSO communication must occur over HTTPS.
- **Secure Credential Storage**: Client Secrets and IdP Certificates must be stored securely.
- **Attribute Mapping Validation**: Ensure that attributes received from the IdP are validated and correctly mapped to prevent privilege escalation or data integrity issues.
- **Session Management**: RemoteDesk's session management should be integrated with SSO logout mechanisms (e.g., Single Logout for SAML).

## Testing
Refer to `sso-test-checklist.md` for a comprehensive list of items to verify during SSO integration testing.

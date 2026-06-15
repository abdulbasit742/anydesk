# SSO Setup Guide

## Supported Providers
- SAML 2.0 (Okta, Azure AD, OneLogin)
- OIDC (Google Workspace, Auth0)

## SAML Configuration
1. Go to Organization Settings > SSO
2. Click "Configure SAML"
3. Enter IdP metadata URL or upload XML
4. Copy ACS URL and Entity ID
5. Configure your IdP with these values
6. Test connection
7. Enable SSO for organization

## OIDC Configuration
1. Go to Organization Settings > SSO
2. Click "Configure OIDC"
3. Enter Client ID and Client Secret
4. Enter Authorization and Token URLs
5. Test connection
6. Enable SSO

## Just-In-Time Provisioning
New users are automatically created on first SSO login.

## Enforcement
- Optional: Users can use SSO or password
- Required: All users must use SSO

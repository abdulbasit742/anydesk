# RemoteDesk SCIM Provisioning Documentation

## Introduction
This document details the System for Cross-domain Identity Management (SCIM) provisioning capabilities within RemoteDesk. SCIM enables automated user and group lifecycle management between an Identity Provider (IdP) and RemoteDesk (Service Provider), ensuring that user identities are consistently maintained across systems.

## SCIM Overview
SCIM is an open standard for automating the exchange of user and group identity information between identity domains. It simplifies user provisioning and deprovisioning, reducing manual administrative tasks and improving security.

RemoteDesk acts as a SCIM Service Provider, allowing an IdP (e.g., Okta, Azure AD, OneLogin) to:
-   Create new user accounts.
-   Update existing user attributes.
-   Deactivate or delete user accounts.
-   Manage group memberships.

## SCIM Endpoints
RemoteDesk exposes the following SCIM 2.0 endpoints:

-   **Service Provider Configuration:** `/scim/v2/ServiceProviderConfig`
    -   Describes the SCIM capabilities of RemoteDesk.
-   **Schemas:** `/scim/v2/Schemas`
    -   Describes the attribute schemas supported by RemoteDesk.
-   **Users:** `/scim/v2/Users`
    -   Endpoint for managing user resources.
-   **Groups:** `/scim/v2/Groups`
    -   Endpoint for managing group resources.

## Authentication
SCIM endpoints are secured using OAuth 2.0 Bearer Tokens. The IdP must be configured with an OAuth client that can obtain an access token with appropriate scopes to interact with RemoteDesk's SCIM API.

## User Provisioning

### 1. Create User
When a user is assigned to the RemoteDesk application in the IdP, the IdP sends a `POST` request to the `/scim/v2/Users` endpoint with the user's attributes in the request body, conforming to the `ScimUserSchema`.

**Example Request (POST /scim/v2/Users):**
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "john.doe@example.com",
  "name": {
    "givenName": "John",
    "familyName": "Doe"
  },
  "emails": [
    {
      "value": "john.doe@example.com",
      "primary": true
    }
  ],
  "active": true
}
```

### 2. Update User
When a user's attributes are updated in the IdP, or their group memberships change, the IdP sends a `PUT` or `PATCH` request to the user's specific SCIM endpoint (`/scim/v2/Users/{id}`).

**Example Request (PATCH /scim/v2/Users/{id}):**
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "Operations": [
    {
      "op": "replace",
      "path": "name.givenName",
      "value": "Jonathan"
    }
  ]
}
```

### 3. Deactivate User
When a user is deprovisioned or deactivated in the IdP, the IdP sends a `PATCH` or `PUT` request to update the user's `active` status to `false`.

**Example Request (PATCH /scim/v2/Users/{id}):**
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "Operations": [
    {
      "op": "replace",
      "path": "active",
      "value": false
    }
  ]
}
```

## Group Provisioning

### 1. Create Group
When a group is created or assigned to RemoteDesk in the IdP, the IdP sends a `POST` request to the `/scim/v2/Groups` endpoint with the group's attributes, conforming to the `ScimGroupSchema`.

**Example Request (POST /scim/v2/Groups):**
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  "displayName": "Engineering Team",
  "members": [
    {
      "value": "<SCIM_USER_ID_1>",
      "display": "John Doe"
    }
  ]
}
```

### 2. Update Group
When group attributes or memberships change in the IdP, the IdP sends a `PUT` or `PATCH` request to the group's specific SCIM endpoint (`/scim/v2/Groups/{id}`).

## Attribute Mapping
It is critical to correctly map attributes between the IdP and RemoteDesk. The `userName` attribute is typically mapped to the user's email address and serves as the primary identifier.

## Error Handling
RemoteDesk's SCIM API will return standard SCIM error responses for invalid requests, authentication failures, or other issues. Refer to the SCIM 2.0 Protocol specification for error codes and details.

## Best Practices
-   **Test Thoroughly:** Always test SCIM provisioning with a small set of users and groups in a staging environment before enabling it in production.
-   **Monitor Logs:** Regularly monitor SCIM provisioning logs in both the IdP and RemoteDesk for any errors or discrepancies.
-   **IdP Configuration:** Ensure your IdP is configured to send only necessary attributes to RemoteDesk to adhere to the principle of least privilege.
-   **Security:** Keep SCIM authentication tokens secure and rotate them regularly.

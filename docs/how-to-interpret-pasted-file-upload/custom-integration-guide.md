# RemoteDesk Custom Integration Guide

## Introduction
This guide provides comprehensive instructions for developers looking to create custom integrations with the RemoteDesk platform. By leveraging our robust APIs and SDKs, partners and customers can extend RemoteDesk's functionality, automate workflows, and embed remote desktop capabilities into their existing applications. This document focuses on using the generated SDKs and understanding the underlying API structure.

## 1. Understanding RemoteDesk APIs

RemoteDesk exposes a set of RESTful APIs that allow programmatic access to its core functionalities, such as session management, device control, user administration, and audit logging. All APIs adhere to industry standards, including OpenAPI specifications, which are used to generate our SDKs.

### 1.1 API Specification
-   The primary source of truth for all API endpoints, request/response schemas, and authentication methods is the OpenAPI specification, accessible via the `sourceApiSpecUrl` defined in `SdkGenerationConfigSchema`.
-   Developers can use tools like Swagger UI or Postman to explore the API directly from the specification.

### 1.2 Authentication
RemoteDesk APIs support various authentication methods, as specified by `authenticationMethod` in `SdkGenerationConfigSchema`:
-   **API Key:** Simple, token-based authentication for server-to-server communication. API keys should be treated as sensitive credentials.
-   **OAuth2:** Recommended for integrations requiring user delegation and secure access to user-specific data. This involves obtaining access tokens through standard OAuth2 flows.

## 2. Using RemoteDesk SDKs

RemoteDesk provides SDKs in multiple `SdkTargetLanguage`s to simplify interaction with our APIs. These SDKs are automatically generated from our OpenAPI specification, ensuring they are always up-to-date with the latest API changes.

### 2.1 SDK Installation
-   Each SDK is published to its respective package manager (e.g., npm for TypeScript/JavaScript, PyPI for Python, Maven for Java).
-   Installation instructions for a specific SDK can be found in its `outputRepositoryUrl` or dedicated documentation.

### 2.2 Core SDK Functionalities
SDKs encapsulate the complexity of HTTP requests, authentication, and response parsing, providing:
-   **Type-Safe API Clients:** Automatically generated client methods for each API endpoint, with strong typing for request and response payloads.
-   **Authentication Helpers:** Utilities for managing API keys or OAuth2 tokens.
-   **Error Handling:** Standardized error responses and exception handling.
-   **Model Definitions:** Data Transfer Objects (DTOs) that mirror the API schemas, facilitating data manipulation.

### 2.3 Example Usage (TypeScript)

```typescript
import { RemoteDeskClient } from '@remotedesk/sdk';
import { CreateSessionRequest } from '@remotedesk/sdk/models';

const client = new RemoteDeskClient({ apiKey: 'YOUR_API_KEY' });

async function createRemoteSession() {
  try {
    const sessionRequest: CreateSessionRequest = {
      deviceName: 'MyRemotePC',
      userId: 'user-123',
      // ... other session parameters
    };
    const session = await client.sessions.createSession(sessionRequest);
    console.log('Session created:', session.id);
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

createRemoteSession();
```

## 3. Building Custom Integrations

### 3.1 Design Considerations
-   **Scope:** Clearly define the scope of your integration. What RemoteDesk functionalities do you need to access or extend?
-   **Security:** Implement secure coding practices. Store API keys and OAuth2 tokens securely. Adhere to the principle of least privilege.
-   **Error Handling:** Design your integration to gracefully handle API errors, network issues, and unexpected responses.
-   **Rate Limiting:** Be aware of API rate limits and implement appropriate retry mechanisms.
-   **Scalability:** Consider the scalability of your integration, especially if it will handle a large volume of requests.

### 3.2 Integration Workflow

1.  **Identify Use Case:** Determine the specific problem your integration will solve or the workflow it will automate.
2.  **Choose SDK/API:** Select the appropriate SDK (`SdkTargetLanguage`) or interact directly with the REST API if an SDK is not available for your preferred language.
3.  **Authentication Setup:** Configure your authentication credentials (API Key or OAuth2).
4.  **Develop Logic:** Write the code for your integration, utilizing the SDK methods or making direct API calls.
5.  **Testing:** Thoroughly test your integration in a development or staging environment.
6.  **Deployment:** Deploy your integration, ensuring it adheres to security best practices and operational guidelines.

## 4. Custom Templates for SDK Generation

For advanced users or partners with specific branding or code style requirements, RemoteDesk supports custom templates for SDK generation. By providing a `customTemplatesUrl` in the `SdkGenerationConfigSchema`, developers can influence the output structure and appearance of the generated SDKs.

## 5. Support and Resources

-   **Developer Portal:** Access API documentation, tutorials, and community forums.
-   **Support Channels:** Contact RemoteDesk support for technical assistance.
-   **Maintainer:** For issues specific to the generated SDKs, contact the `maintainer` specified in the `SdkGenerationConfigSchema`.

## Conclusion

This guide provides the foundation for building powerful custom integrations with RemoteDesk. By following these guidelines and leveraging the provided tools, developers can unlock the full potential of the RemoteDesk platform and create tailored solutions that meet their unique business needs.

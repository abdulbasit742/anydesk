# RemoteDesk Advanced Webhooks

This document details the Advanced Webhooks system within RemoteDesk, providing enhanced capabilities for integrating RemoteDesk events with external systems and workflows.

## Overview
Advanced Webhooks extend the basic webhook functionality by offering more granular control over event triggers, robust delivery mechanisms, and improved security. This allows organizations to build highly customized integrations, automate workflows, and react to RemoteDesk events in real-time within their existing IT infrastructure.

## Features
- **Granular Event Triggers**: Subscribe to a wider range of specific events (e.g., `session.started`, `file_transfer.completed`, `insight.generated`, `threat.detected`).
- **Configurable Filters**: Define conditions (e.g., `severity: critical`) to filter webhook payloads, ensuring only relevant data is sent.
- **Secure Delivery**: Webhooks are signed with a secret using HMAC-SHA256, allowing recipients to verify the authenticity and integrity of the payload.
- **Retry Mechanism**: Automatic retries for failed deliveries with configurable intervals and maximum attempts.
- **Delivery Logging**: Comprehensive logging of all delivery attempts, including status codes and error messages.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`WebhookEventType`**: An enum defining the various events that can trigger a webhook (e.g., `SESSION_STARTED`, `THREAT_DETECTED`).
- **`WebhookStatus`**: An enum representing the status of a webhook subscription (`ACTIVE`, `INACTIVE`, `FAILED`).
- **`WebhookSubscription`**: Defines a single webhook subscription, including its `organizationId`, `targetUrl`, `secret` for signing, `events` it subscribes to, `status`, and `filterConditions`.
- **`WebhookDeliveryAttempt`**: Records details of each attempt to deliver a webhook, including `payload`, `statusCode`, and `success` status.
- **`AdvancedWebhookConfig`**: Configuration settings for the entire advanced webhook system, such as `enabled`, `maxRetries`, `retryIntervalSeconds`, and `deliveryTimeoutSeconds`.
- **Location**: `remotedesk/packages/shared/src/customization/advanced-webhooks.dto.ts`

### API Service Logic
- **`AdvancedWebhooksService.ts`**: Manages webhook subscriptions, event triggering, and delivery attempts on the API server.
  - **Configuration Management**: Loads and updates advanced webhook settings.
  - **Subscription Management**: Provides methods to `createSubscription`, `updateSubscription`, and retrieve subscriptions for an organization.
  - **Event Triggering**: The `triggerEvent` method is called by other services when a relevant event occurs. It identifies all matching active subscriptions.
  - **Secure Payload Generation**: Before sending, it constructs the payload and generates an HMAC-SHA256 signature using the subscription's secret.
  - **Asynchronous Delivery**: Sends webhook payloads to `targetUrl`s asynchronously, handling retries for failed attempts.
  - **Delivery Logging**: Records each `WebhookDeliveryAttempt` for auditing and troubleshooting.
- **Location**: `remotedesk/apps/api/src/customization/AdvancedWebhooksService.ts`

### API Routes
- **`/api/customization/webhooks/subscriptions` (POST)**: Create a new webhook subscription.
- **`/api/customization/webhooks/subscriptions/:id` (PUT)**: Update an existing webhook subscription.
- **`/api/customization/webhooks/subscriptions/organization/:organizationId` (GET)**: Retrieve all webhook subscriptions for a given organization.
- **`/api/customization/webhooks/config` (POST/GET)**: Manage the global configuration for advanced webhooks.
- **Location**: `remotedesk/apps/api/src/customization/customization.routes.ts`

## Usage

### Configuration
1. **Enable Advanced Webhooks**: In the RemoteDesk admin panel, enable the feature.
2. **Create Subscriptions**: Define new webhook subscriptions, specifying the `targetUrl`, `events` to subscribe to, and optional `filterConditions`.
3. **Manage Secrets**: Securely store and manage the `secret` for each webhook subscription.

### Event Flow
1. An event occurs within RemoteDesk (e.g., a session starts, a threat is detected).
2. The relevant service calls `advancedWebhooksService.triggerEvent()`.
3. The `AdvancedWebhooksService` identifies all active subscriptions that match the `eventType` and `filterConditions`.
4. For each matching subscription, it constructs a signed payload and attempts delivery to the `targetUrl`.
5. If delivery fails, it retries according to the configured `maxRetries` and `retryIntervalSeconds`.
6. All delivery attempts are logged and can be reviewed by administrators.

## Technical Considerations
- **Security**: The HMAC signature is crucial for verifying webhook authenticity. Recipients must implement signature verification.
- **Idempotency**: External systems receiving webhooks should be designed to handle idempotent requests, as retries might lead to duplicate deliveries.
- **Scalability**: The webhook delivery system must be scalable to handle a high volume of events and subscriptions without impacting core RemoteDesk performance.
- **Monitoring**: Robust monitoring of webhook delivery success rates and latency is essential.

## Future Enhancements
- **Webhook Testing Tools**: Provide a UI for testing webhook delivery and inspecting payloads.
- **Event Payload Customization**: Allow users to customize the structure and content of webhook payloads.
- **Rate Limiting**: Implement rate limiting for webhook deliveries to prevent overwhelming target systems.
- **Dead-letter Queue**: Implement a dead-letter queue for failed webhooks that exhaust all retries, allowing for manual inspection and reprocessing.

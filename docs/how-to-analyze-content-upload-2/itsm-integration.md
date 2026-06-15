# RemoteDesk ITSM Integration

This document describes the functionality and implementation of IT Service Management (ITSM) integration within RemoteDesk, enabling automated ticket creation and updates in external ITSM systems.

## Overview
ITSM integration streamlines incident management and service request fulfillment by automatically creating tickets in platforms like ServiceNow or Jira Service Management when specific events occur in RemoteDesk. This reduces manual effort, ensures consistent incident logging, and improves response times for support teams.

## Features
- **Automated Ticket Creation**: Automatically create incident or service request tickets based on configurable RemoteDesk events (e.g., critical errors, security alerts, user-reported issues).
- **Configurable Ticket Details**: Populate ITSM tickets with relevant information from RemoteDesk, such as session IDs, device IDs, user details, and event summaries.
- **Customizable Priority**: Assign ticket priorities based on the severity of the RemoteDesk event.
- **Default Assignee**: Configure a default team or individual to assign newly created tickets to.
- **Bi-directional Sync (Future)**: Potential for syncing ticket status and comments between RemoteDesk and the ITSM system.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`ItsmTicketType`**: An enum defining the types of ITSM tickets (incident, service request, problem).
- **`ItsmTicketPriority`**: An enum defining the priority levels for ITSM tickets.
- **`ItsmTicket`**: Describes a single ITSM ticket, including its ID, type, priority, summary, description, status, requester, assigned to, timestamps, and optional RemoteDesk context (sessionId, deviceId).
- **`ItsmConfig`**: Configuration settings for ITSM integration, such as `enabled`, `apiEndpoint`, `apiKey`, `defaultAssignee`, and `autoCreateOnIncident`.
- **Location**: `remotedesk/packages/shared/src/enterprise/itsm.dto.ts`

### API Service Logic
- **`ItsmIntegrationService.ts`**: Manages the ITSM integration on the API server.
  - **Configuration Management**: Loads and updates ITSM integration settings.
  - **Ticket Creation**: Provides a method (`createTicket`) to programmatically create ITSM tickets via the configured API endpoint.
  - **Automated Incident Creation**: Offers a specialized method (`autoCreateIncidentTicket`) to create incident tickets automatically when critical events are detected, based on the `autoCreateOnIncident` setting.
  - **API Communication**: Uses `axios` to send ticket data to the external ITSM platform with appropriate authentication.
  - **Error Handling**: Logs errors if ticket creation fails.
- **Location**: `remotedesk/apps/api/src/enterprise/ItsmIntegrationService.ts`

## Usage

### Configuration
1. **Enable ITSM Integration**: In the RemoteDesk admin panel, enable the ITSM integration feature.
2. **Configure API Endpoint**: Provide the ITSM platform's API endpoint for ticket creation.
3. **Provide API Key**: Enter the necessary API key or token for authentication with the ITSM system.
4. **Set Default Assignee**: Optionally configure a default team or user to assign automatically created tickets to.
5. **Enable Auto-Create on Incident**: If desired, enable automatic ticket creation when RemoteDesk detects a critical incident.

### Event Flow
1. A critical event or user-reported issue occurs in RemoteDesk.
2. If `autoCreateOnIncident` is enabled, the `ItsmIntegrationService`'s `autoCreateIncidentTicket` method is invoked.
3. Alternatively, other RemoteDesk services or an administrator can manually call `itsmIntegrationService.createTicket()`.
4. The `ItsmIntegrationService` formats the ticket data and sends it to the external ITSM platform.
5. A new ticket is created in the ITSM system, containing relevant details from RemoteDesk.

## Technical Considerations
- **Security**: The API key for ITSM integration must be stored securely.
- **API Rate Limits**: Be mindful of rate limits imposed by the ITSM provider's API.
- **Custom Fields**: Support for mapping RemoteDesk data to custom fields in the ITSM system may be required.
- **Webhooks from ITSM**: To achieve bi-directional synchronization, the ITSM system would need to send webhooks back to RemoteDesk for status updates.
- **Incident Correlation**: Mechanisms to prevent duplicate ticket creation for the same underlying incident.

## Future Enhancements
- **Bi-directional Sync**: Synchronize ticket status and comments between RemoteDesk and the ITSM system.
- **Customizable Templates**: Allow administrators to define custom ticket templates for different event types.
- **User Self-Service Portal Integration**: Allow users to view their RemoteDesk-generated tickets directly from a self-service portal.
- **Change Management Integration**: Integrate with change management processes for planned maintenance or updates.

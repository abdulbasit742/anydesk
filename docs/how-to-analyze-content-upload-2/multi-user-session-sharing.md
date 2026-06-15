# RemoteDesk Multi-User Session Sharing

This document outlines the functionality and implementation of multi-user session sharing within RemoteDesk, enabling multiple participants to join and interact within a single remote session.

## Overview
Multi-user session sharing transforms a typical one-to-one remote session into a collaborative environment. It allows a host to invite multiple viewers or collaborators, each with configurable roles and permissions, to participate in the same remote desktop session. This is ideal for team collaboration, training, and multi-person support scenarios.

## Features
- **Multiple Participants**: Support for multiple viewers and collaborators in a single session.
- **Role-Based Permissions**: Assign different roles (Host, Viewer, Collaborator, Observer) with distinct capabilities (e.g., control, annotation, chat).
- **Session Invitations**: Securely invite participants via email or shareable links.
- **Participant Management**: Host can add, remove, and update roles of participants during an active session.
- **Connection Status**: Real-time visibility into participant connection status.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`UserRoleInSession`**: An enum defining the different roles a user can have in a session.
- **`SessionParticipant`**: Describes a participant in a session, including their ID, name, role, and capabilities (canControl, canAnnotate, canChat, isConnected).
- **`MultiUserSessionConfig`**: Configuration settings for multi-user sessions, such as `allowMultipleViewers` and `defaultViewerRole`.
- **`SessionInvitation`**: Represents an invitation to a session, including details like `sessionId`, `invitedByUserId`, `invitedToUserId`, `role`, `status`, and expiry.
- **Location**: `remotedesk/packages/shared/src/collaboration/multi-user-session.dto.ts`

### API Service Logic
- **`MultiUserSessionService.ts`**: Manages multi-user session state, participants, and invitations on the API server.
  - **Session Creation**: Initializes a multi-user session with the host as the first participant.
  - **Participant Management**: Provides methods to add, remove, and update participant roles and connection statuses.
  - **Invitation System**: Handles the creation, acceptance, and expiration of session invitations.
  - **Configuration Management**: Stores and updates multi-user session settings.
- **Location**: `remotedesk/apps/api/src/collaboration/MultiUserSessionService.ts`

### User Interface (UI)
- **`SessionParticipantsList.tsx`**: A React component for the web application that displays a list of current session participants, their roles, and connection status. It also allows the host to manage participants (remove, change role).
- **Location**: `remotedesk/apps/web/src/collaboration/SessionParticipantsList.tsx`
- **`InviteParticipantUI.tsx`**: A React component for the web application that provides an interface for the host to invite new participants to a session by email and assign them a role.
- **Location**: `remotedesk/apps/web/src/collaboration/InviteParticipantUI.tsx`

## Usage

### Host Side
1. Start a remote session.
2. Access the participant management panel.
3. Use the `InviteParticipantUI` to send invitations to other users, specifying their desired role (Viewer, Collaborator, Observer).
4. Monitor and manage participants using the `SessionParticipantsList`, including removing users or changing their roles.

### Invited Participant Side
1. Receive a session invitation (e.g., via email).
2. Accept the invitation to join the session with the assigned role.
3. Interact with the session based on the granted permissions.

## Technical Considerations
- **Real-time Updates**: Ensuring participant list and permissions are updated in real-time across all connected clients.
- **Access Control**: Robust authorization mechanisms to enforce role-based permissions for actions like input control, annotation, and chat.
- **Session State Management**: Maintaining consistent session state across multiple participants and handling disconnections/reconnections gracefully.
- **Scalability**: Designing the system to handle a large number of concurrent multi-user sessions and participants.

## Future Enhancements
- **Co-browsing**: Synchronized web browsing for all participants.
- **Voice/Video Conferencing**: Integrated audio and video calls within the session.
- **Screen Sharing Control**: Allow collaborators to take over screen sharing.
- **Breakout Rooms**: For larger training or meeting scenarios.
- **Guest Access**: Allow temporary access without requiring a full user account.

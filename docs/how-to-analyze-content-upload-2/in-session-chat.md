# RemoteDesk In-Session Chat

This document describes the functionality and implementation of the real-time, in-session chat feature within RemoteDesk, enabling text-based communication between participants during a remote session.

## Overview
In-session chat provides a convenient and immediate communication channel for all participants in a RemoteDesk session. It allows for quick exchanges of information, instructions, and coordination without interrupting the visual flow of the remote desktop, enhancing overall collaboration and support efficiency.

## Features
- **Real-time Messaging**: Instantaneous delivery of text messages to all active participants.
- **Sender Identification**: Clearly displays the sender's name for each message.
- **System Messages**: Ability to send automated system messages for events like participant joining/leaving.
- **Configurable Options**: Host-side configuration to enable/disable chat and control features like file attachments.
- **Scrollable History**: Maintains a history of messages for review during the session.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`ChatMessage`**: Defines the structure of a chat message, including ID, session ID, sender ID, sender name, timestamp, content, and a flag for system messages.
- **`ChatConfig`**: Stores configuration settings for the chat feature, such as `enabled`, `allowFileAttachments`, and `maxAttachmentSizeMB`.
- **Location**: `remotedesk/packages/shared/src/collaboration/chat.dto.ts`

### API Service Logic
- **`ChatService.ts`**: Manages chat messages on the API server.
  - **Configuration Management**: Stores and updates chat settings.
  - **Message Storage**: Stores messages per session (in a real system, this would be persisted).
  - **Message Handling**: Provides methods to add new messages and retrieve message history.
  - **System Messages**: Facilitates the creation of automated system messages.
- **Location**: `remotedesk/apps/api/src/collaboration/ChatService.ts`

### User Interface (UI)
- **`ChatWindow.tsx`**: A React component for both web and desktop applications that provides the chat interface, including message display, input field, and send button.
- **Location**: `remotedesk/apps/web/src/collaboration/ChatWindow.tsx` (can be reused in desktop app)

## Usage

### During a Remote Session
1. Open the chat window, typically accessible via an icon or a dedicated panel in the session interface.
2. Type your message into the input field.
3. Press Enter or click the "Send" button to transmit the message.
4. All participants in the session will see the message appear in their chat window in real-time.
5. System messages will inform participants about important session events.

## Technical Considerations
- **Real-time Communication**: Utilizes WebSocket or Socket.IO for efficient, low-latency message exchange.
- **Scalability**: Ensuring the chat system can handle a large number of concurrent messages and sessions.
- **Message Persistence**: Deciding on the strategy for storing chat history (e.g., in-memory for session duration, or persistent storage for audit/review).
- **Security**: Sanitizing message content to prevent XSS attacks and ensuring only authorized participants can send messages.
- **Notification**: Providing visual or auditory notifications for new messages, especially when the chat window is not in focus.

## Future Enhancements
- **File Attachments**: Allow users to send files through the chat (if `allowFileAttachments` is enabled).
- **Emoji Support**: Integrate emoji pickers for richer communication.
- **Mentions**: Ability to mention specific participants (`@username`).
- **Message Editing/Deletion**: Functionality to edit or delete sent messages.
- **Read Receipts**: Indicate when messages have been read by participants.

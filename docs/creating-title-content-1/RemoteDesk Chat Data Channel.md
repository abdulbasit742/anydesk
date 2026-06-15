# RemoteDesk Chat Data Channel

## 1. Overview

The in-session chat feature in RemoteDesk allows real-time text communication between the host and viewer during a remote session. This communication occurs over a dedicated WebRTC data channel, leveraging the existing multiplexing layer.

## 2. Architecture

### 2.1 Data Channel Integration
Chat messages are encapsulated within the `DataChannelEnvelope` with the `CHAT_MESSAGE` type. This allows the `MessageRouter` to efficiently direct chat-specific payloads to the `ChatManager`.

### 2.2 Chat Message Schema
Chat messages adhere to a defined schema (`ChatMessage`) which includes:
- `id`: A unique identifier for each message.
- `senderId`: The ID of the user who sent the message.
- `sessionId`: The ID of the current remote session.
- `timestamp`: The time the message was sent.
- `type`: The type of message, e.g., `TEXT` for user messages or `SYSTEM` for automated notifications.
- `content`: The actual message text.

### 2.3 Chat Manager
The `ChatManager` is responsible for:
- Sending new chat messages through the `MultiplexedDataChannel`.
- Receiving and processing incoming chat messages.
- Maintaining a local store of chat messages for display.
- Notifying UI components of new messages.

### 2.4 System Messages
In addition to user-generated text messages, the chat channel supports `SYSTEM` messages. These messages are used to inform users about significant session events, such as a user joining or leaving, or the start/end of a file transfer. This provides context and enhances the user experience.

## 3. User Interface

### 3.1 Chat Panel
The `ChatPanel` component in the desktop application provides the user interface for the chat feature. It includes:
- A message list to display historical and new messages.
- A message input field for users to type and send messages.
- Timestamps for each message to provide context.
- Typing indicators (future enhancement) to show when the other party is typing.
- Delivery status (future enhancement) to indicate if a message has been sent or read.

## 4. Message Flow

1. **Sending a Message:**
   - A user types a message in the `ChatPanel` and presses Enter or clicks send.
   - The `ChatPanel` invokes `ChatManager.sendMessage()`.
   - The `ChatManager` creates a `ChatMessage` object, assigns a unique ID, timestamp, and sender/session IDs.
   - The message is added to the local message store and immediately displayed in the UI.
   - The `ChatManager` sends the `ChatMessage` payload wrapped in a `DataChannelEnvelope` (type `CHAT_MESSAGE`) via the `MultiplexedDataChannel`.

2. **Receiving a Message:**
   - The `MultiplexedDataChannel` receives a `DataChannelEnvelope` with `CHAT_MESSAGE` type.
   - The `MessageRouter` routes the envelope to the `ChatManager`.
   - The `ChatManager` extracts the `ChatMessage` payload.
   - The message is added to the local message store.
   - The `ChatManager` notifies the `ChatPanel` (via `onNewMessage` callback) to update the UI and display the new message.

## 5. Future Enhancements

- **Typing Indicators:** Displaying when the remote user is typing.
- **Read Receipts:** Indicating when messages have been read.
- **Emoji Support:** Richer communication options.
- **Message Editing/Deletion:** Ability to modify or remove sent messages.
- **Notification System:** Desktop notifications for new chat messages when the chat panel is not in focus.

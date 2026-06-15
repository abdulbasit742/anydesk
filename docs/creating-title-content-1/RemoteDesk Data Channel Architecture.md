# RemoteDesk Data Channel Architecture

## 1. Introduction

The RemoteDesk application leverages WebRTC Data Channels to establish a direct, peer-to-peer, and secure communication pathway between the host and viewer clients. This architecture is designed to support various real-time features such as file transfer, clipboard synchronization, and in-session chat, ensuring low-latency and high-throughput data exchange.

## 2. Core Components

### 2.1 WebRTC Data Channels
WebRTC Data Channels provide a generic API for sending arbitrary data between peers. They offer configurable reliability and ordering, making them suitable for diverse application requirements. In RemoteDesk, data channels are established as part of the WebRTC peer connection setup, alongside audio/video streams.

### 2.2 Channel Registry
The `ChannelRegistry` acts as a central repository for managing all active `RTCDataChannel` instances. It allows different application modules to register and retrieve specific data channels by their labels, ensuring proper routing and isolation of communication streams. This prevents cross-talk and simplifies channel management.

### 2.3 Data Channel Envelope
All messages transmitted over the multiplexed data channel are encapsulated within a standardized `DataChannelEnvelope`. This envelope provides a consistent structure for all inter-client communications, including:
- `id`: A unique identifier for each message, facilitating tracking and deduplication.
- `type`: An enum (`DataChannelMessageType`) specifying the content type (e.g., `FILE_TRANSFER`, `CLIPBOARD_SYNC`, `CHAT_MESSAGE`). This is crucial for message routing.
- `payload`: The actual data specific to the message type.
- `timestamp`: The time the message was sent, useful for latency measurement and ordering.
- `senderId` and `sessionId`: Identifiers for the origin and context of the message.

### 2.4 Message Router
The `MessageRouter` is responsible for dispatching incoming `DataChannelEnvelope` messages to the appropriate handlers based on their `type`. It allows different features (e.g., File Transfer, Clipboard Sync, Chat) to subscribe to specific message types, ensuring that each module only processes relevant data. This promotes modularity and separation of concerns.

### 2.5 Backpressure Handling
To prevent network congestion and ensure smooth data flow, especially during high-volume transfers like file sharing, a `BackpressureHandler` is implemented. This component monitors the `bufferedAmount` of the `RTCDataChannel` and pauses transmission when the buffer exceeds a predefined threshold. It resumes transmission once the buffer clears, preventing data loss and maintaining channel stability.

### 2.6 Multiplexed Data Channel
The `MultiplexedDataChannel` class wraps the raw `RTCDataChannel`, providing a higher-level abstraction for sending and receiving structured messages. It integrates the `MessageRouter` and `BackpressureHandler`, offering a unified interface for application features to interact with the underlying WebRTC data channel. It also handles JSON serialization/deserialization and Zod-based message validation.

### 2.7 Heartbeat Manager
The `HeartbeatManager` is responsible for sending periodic heartbeat messages over the data channel. These heartbeats serve multiple purposes:
- **Liveness Detection:** Confirming that the data channel is still active and responsive.
- **Latency Measurement:** Calculating the round-trip time (RTT) between peers, providing valuable network performance metrics.
- **Keep-Alive:** Preventing the data channel from timing out due to inactivity.

## 3. Data Flow

1. **Initialization:** Upon establishing a WebRTC peer connection, an `RTCDataChannel` is created and registered with the `ChannelRegistry`.
2. **Message Sending:** When an application feature (e.g., Chat) needs to send data, it constructs a payload and calls `MultiplexedDataChannel.send()` with the appropriate `DataChannelMessageType`.
3. **Serialization & Validation:** The `MultiplexedDataChannel` wraps the payload in a `DataChannelEnvelope`, serializes it to JSON, and performs validation using Zod schemas.
4. **Backpressure Check:** Before sending, the `BackpressureHandler` checks the channel's buffer. If high, it pauses transmission until the buffer clears.
5. **Transmission:** The JSON string is sent over the `RTCDataChannel`.
6. **Message Reception:** On the receiving end, the `RTCDataChannel` emits a `message` event.
7. **Deserialization & Validation:** The `MultiplexedDataChannel` parses the JSON string and validates the `DataChannelEnvelope`.
8. **Routing:** The `MessageRouter` inspects the `DataChannelMessageType` and dispatches the envelope to all subscribed handlers for that type.
9. **Feature Processing:** The relevant application feature (e.g., `ChatManager`, `FileTransferReceiver`) processes the message payload.

## 4. Security Considerations

- **Encryption:** All data transmitted over WebRTC Data Channels is encrypted by default using DTLS (Datagram Transport Layer Security), ensuring confidentiality and integrity.
- **Authentication:** While WebRTC provides transport security, application-level authentication and authorization are handled by the backend (e.g., `AuditService`, `FeatureFlagService`) to control access to features and log sensitive actions.
- **Message Validation:** Zod schemas are used to validate incoming message payloads, preventing malformed data from causing application errors or security vulnerabilities.

## 5. Extensibility

The modular design of the data channel architecture, with its clear separation of concerns (registry, router, handlers), makes it highly extensible. New features requiring real-time communication can be easily integrated by defining new `DataChannelMessageType`s, creating corresponding handlers, and subscribing them to the `MessageRouter`.

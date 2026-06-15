# RemoteDesk Augmented Reality (AR) Support

This document outlines the Augmented Reality (AR) support capabilities within RemoteDesk, enabling technicians to provide visual guidance and interactive assistance for physical hardware or machinery.

## Overview
AR Support in RemoteDesk allows a remote technician to see what a local user sees through their mobile device's camera feed and overlay virtual annotations, instructions, or diagrams directly onto the real-world view. This revolutionizes support for physical assets, making complex repairs, installations, or inspections more intuitive and efficient. The system facilitates real-time collaboration in a shared AR space.

## Features
- **Live AR Stream**: Share a mobile device's camera feed with a remote viewer, with optional depth and environmental understanding data.
- **Real-time 3D Annotations**: Remote technicians can place virtual pointers, draw, add text labels, or highlight objects in the local user's AR view.
- **Persistent Annotations**: Annotations can be anchored to real-world objects, remaining in place even if the device moves.
- **Object and Plane Detection**: Leverage AR capabilities to detect surfaces and objects for more accurate annotation placement.
- **Remote Control via AR (Optional)**: Future capability to trigger actions on connected devices by interacting with virtual elements in the AR space.
- **Configurable AR Settings**: Administrators can configure AR features, such as default annotation colors and history limits.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`ARAnnotationType`**: An enum defining various types of AR annotations (e.g., `POINTER`, `TEXT`, `DRAWING`).
- **`ARAnnotation`**: Represents a single AR annotation, including its type, 3D position, orientation, and content (text, drawing points).
- **`ARStreamStatus`**: An enum for the status of an AR stream (`ACTIVE`, `PAUSED`, `ENDED`).
- **`ARStreamInfo`**: Details about an active AR stream, including session IDs, device capabilities (video, depth, plane detection), and viewer capabilities.
- **`ARConfig`**: Configuration settings for the AR system, such as `enabled`, `defaultAnnotationColor`, `maxAnnotationHistory`, and `allowRemoteControlViaAR`.
- **Location**: `remotedesk/packages/shared/src/ar/ar.dto.ts`

### API Service Logic
- **`ARService.ts`**: Manages AR streams and annotations on the API server.
  - **Configuration Management**: Loads and updates AR settings.
  - **AR Stream Management**: Handles starting, ending, and tracking active AR streams.
  - **Annotation Management**: Stores and retrieves AR annotations for sessions, including history management.
  - **Real-time Communication**: (Conceptual) Integrates with WebSocket or similar for broadcasting annotations to all session participants.
- **Location**: `remotedesk/apps/api/src/ar/ARService.ts`

### API Routes
- **`/api/ar/stream/start` (POST)**: Initiates an AR stream for a session.
- **`/api/ar/stream/end` (POST)**: Terminates an AR stream.
- **`/api/ar/stream/:sessionId` (GET)**: Retrieves information about an active AR stream.
- **`/api/ar/annotations` (POST)**: Adds a new AR annotation to a session.
- **`/api/ar/annotations/:sessionId` (GET)**: Retrieves all annotations for a given session.
- **`/api/ar/annotations/:sessionId` (DELETE)**: Clears all annotations for a session.
- **`/api/ar/config` (GET/POST)**: Manages the global configuration for AR features.
- **Location**: `remotedesk/apps/api/src/ar/ar.routes.ts`

### Mobile Application Integration
- The mobile application (host) will capture camera feed and AR data (e.g., depth, detected planes) and stream it to the RemoteDesk infrastructure.
- It will render incoming AR annotations from the remote technician onto its camera view.
- The mobile application (viewer) will display the AR stream and provide tools for creating annotations.

## Technical Considerations
- **Platform-Specific AR SDKs**: Requires integration with native AR SDKs (e.g., ARKit for iOS, ARCore for Android) for camera access, tracking, and rendering.
- **Real-time Data Streaming**: Efficient streaming of video, depth data, and AR anchor information with low latency is critical.
- **Coordinate System Synchronization**: Maintaining a consistent understanding of the 3D space between the host and viewer devices.
- **Performance**: AR processing can be resource-intensive, requiring optimization for mobile device performance and battery life.
- **Network Bandwidth**: High bandwidth requirements for streaming AR data.

## Future Enhancements
- **3D Model Overlay**: Overlay pre-defined 3D models onto the real-world view for complex instructions.
- **AI-Powered Object Recognition**: Automatically identify objects in the camera feed to suggest relevant annotations or knowledge base articles.
- **Spatial Audio**: Integrate spatial audio cues for annotations.
- **AR-driven Remote Control**: Allow technicians to interact with virtual controls in the AR space that trigger actions on connected devices.

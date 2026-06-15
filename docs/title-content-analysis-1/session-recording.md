# RemoteDesk Session Recording Architecture

This document outlines the architecture for the session recording feature in RemoteDesk, covering the components involved, data flow, and key design considerations.

## 1. Overview

The session recording feature allows users to record remote desktop sessions for later review. This involves capturing video and audio streams from the host, transferring them to the viewer (or directly to storage), and providing mechanisms for storage, playback, and management.

## 2. Components

### 2.1 Host Desktop Client (Electron Main & Renderer)
*   **Renderer Process**: Responsible for capturing the screen and audio streams using WebRTC `MediaRecorder` API. It segments the stream into chunks and sends them to the main process.
*   **Main Process**: Receives recording chunks from the renderer, handles file I/O (writing chunks to disk), manages recording state, and exposes IPC APIs for control and metadata management.

### 2.2 Viewer Desktop Client (Electron Main & Renderer)
*   **Renderer Process**: Provides UI for starting/stopping recordings (if allowed), displaying recording status, and playing back recorded sessions.
*   **Main Process**: Manages local storage of recordings, provides APIs for listing, deleting, and opening recording files.

### 2.3 API Service (Backend)
*   **Optional**: For cloud-based recording storage, the API service would handle receiving recording chunks/files from the host, storing them (e.g., S3), and managing metadata in a database.

### 2.4 Web Dashboard
*   **Frontend**: Displays a list of available recordings (from cloud storage or metadata API), provides playback functionality (e.g., streaming from S3), and allows management (delete, download).

## 3. Data Flow

### 3.1 Recording Initiation
1.  **Viewer Action**: User initiates recording from the Viewer Desktop Client UI.
2.  **IPC Call**: Renderer sends `session-recording:start` IPC message to Main process with initial metadata (sessionId, resolution, etc.).
3.  **Main Process**: Validates request, initializes recording state, and prepares file path for storage. Responds with success/failure.
4.  **Renderer (Host)**: Upon successful initiation, the Host Renderer starts `MediaRecorder` to capture `MediaStream` (from `getDisplayMedia` and `getUserMedia`).

### 3.2 Recording Data Transfer
1.  **MediaRecorder**: Generates `Blob` (data chunks) periodically (e.g., every 1-5 seconds).
2.  **Renderer (Host)**: Sends each `Blob` as a `session-recording:chunk` IPC message to the Main process.
3.  **Main Process (Host)**: Receives chunks. In a simple local recording setup, it writes these chunks to a temporary file. For cloud recording, it would upload chunks to S3 or a similar storage service via the API.

### 3.3 Recording Termination
1.  **User Action**: User stops recording from Viewer or Host UI.
2.  **IPC Call**: Renderer sends `session-recording:control` (action: `stop`) to Main process.
3.  **Main Process (Host)**: Stops `MediaRecorder`, finalizes the recording file (e.g., concatenates chunks, adds metadata), updates metadata (endTime, duration, fileSize), and stores it locally. If cloud recording, it finalizes upload and updates database metadata via API.

### 3.4 Playback (Local)
1.  **Viewer Action**: User selects a recording from `RecordingList` in Desktop Client.
2.  **IPC Call**: Renderer requests recording metadata/path from Main process.
3.  **Main Process**: Provides local file path.
4.  **Renderer**: Loads the local video file into an HTML `<video>` element for playback.

### 3.5 Playback (Web/Cloud)
1.  **Web Action**: User selects a recording from `WebRecordingList` on the Web Dashboard.
2.  **API Call**: Frontend requests recording metadata, which includes an S3 URL (or similar public URL).
3.  **Frontend**: Loads the S3 URL into an HTML `<video>` element for playback.

## 4. Key Design Considerations

### 4.1 Performance
*   **Chunking**: Recording data is sent in small chunks to prevent memory overload and allow for progressive saving/uploading.
*   **Codec Selection**: Choose efficient codecs (e.g., VP8, H.264) for good compression and browser compatibility.
*   **Hardware Acceleration**: Leverage Electron/Chromium's hardware acceleration for encoding/decoding where possible.

### 4.2 Storage
*   **Local Storage**: Recordings are initially saved to the user's local application data directory (`app.getPath('userData')`).
*   **Cloud Storage (Optional)**: For persistent and shared access, recordings can be uploaded to cloud storage (e.g., AWS S3, Google Cloud Storage). This requires secure upload mechanisms and proper access control.
*   **Metadata Management**: Store recording metadata (sessionId, duration, file path/URL, etc.) in a database (e.g., PostgreSQL via Prisma) for easy querying and management.

### 4.3 Security
*   **Consent**: Ensure explicit user consent before recording any session. Display clear indicators when recording is active.
*   **Data Encryption**: Encrypt recordings at rest (on disk/cloud) and in transit (WebRTC SRTP, HTTPS for API uploads).
*   **Access Control**: Implement robust authentication and authorization to ensure only authorized users can access or manage recordings.
*   **Data Minimization**: Only record necessary data. Avoid capturing sensitive information if not required.

### 4.4 Scalability
*   **Cloud Uploads**: For large-scale deployments, direct uploads from the host to cloud storage (e.g., using pre-signed URLs) can offload the API service.
*   **Transcoding**: Consider server-side transcoding for optimizing recordings for different playback devices or formats.

### 4.5 User Experience
*   **Clear Indicators**: Provide clear visual cues (e.g., a prominent 

# RemoteDesk Remote Audio Streaming

This document describes the functionality and implementation of remote audio streaming within RemoteDesk, enabling the transmission of audio from the remote host to the local viewer.

## Overview
Remote audio streaming is crucial for scenarios where sound is an integral part of the remote experience, such as multimedia playback, online meetings, or troubleshooting audio issues. RemoteDesk provides the capability to stream system audio or microphone input from the host to the viewer.

## Features
- **System Audio Streaming**: Capture and stream all audio playing on the remote host's system.
- **Microphone Streaming**: Capture and stream audio from the remote host's microphone.
- **Configurable Audio Source**: Ability to select between system audio and microphone.
- **Volume Control**: Adjustable volume for the streamed audio.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`AudioStreamType`**: An enum defining the types of audio streams (`SYSTEM_AUDIO`, `MICROPHONE`).
- **`RemoteAudioConfig`**: Configuration settings for remote audio, including `enabled`, `streamType`, and `volume`.
- **`AudioStreamData`**: Structure for transmitting raw audio data, including type, actual audio data (ArrayBuffer), and timestamp.
- **Location**: `remotedesk/packages/shared/src/remote-control/remote-audio.dto.ts`

### Desktop Application Logic
- **`RemoteAudioService.ts`**: Manages audio capture and streaming on the desktop client.
  - **Configuration Management**: Loads and updates remote audio settings.
  - **Audio Capture**: Utilizes browser APIs (`navigator.mediaDevices.getDisplayMedia` for system audio, `getUserMedia` for microphone) to capture audio streams.
  - **Audio Processing**: Sets up an `AudioContext` to process and prepare audio data for transmission.
  - **Stream Transmission**: (Conceptual) The captured audio stream would be sent over a WebRTC data channel or similar mechanism to the viewer.
- **Location**: `remotedesk/apps/desktop/src/remote-control/RemoteAudioService.ts`

## Usage

### Host Side
1. Access the audio settings within the RemoteDesk desktop application.
2. Enable remote audio streaming.
3. Select the desired audio source (System Audio or Microphone).
4. Adjust the streaming volume as needed.

### Viewer Side
1. During a remote session, the viewer will automatically receive and play the streamed audio.
2. The viewer can control the playback volume locally.

## Technical Considerations
- **Latency**: Minimizing audio latency is critical for a good user experience, especially for interactive applications or conversations.
- **Codec Selection**: Choosing efficient audio codecs (e.g., Opus) to balance quality and bandwidth usage.
- **Synchronization**: Ensuring audio and video streams are synchronized to avoid lip-sync issues.
- **Privacy**: Clearly informing the host when their microphone or system audio is being streamed and providing easy controls to stop it.

## Future Enhancements
- **Bidirectional Audio**: Allow the viewer to speak to the host.
- **Audio Device Selection**: Allow the host to select specific audio input/output devices.
- **Noise Suppression**: Implement client-side noise suppression for microphone input.
- **Audio Quality Settings**: Provide options for adjusting audio quality (bitrate, sample rate).

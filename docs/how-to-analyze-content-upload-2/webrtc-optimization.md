# RemoteDesk WebRTC Optimization

This document describes the WebRTC Optimization features within RemoteDesk, designed to ensure high-quality and reliable remote sessions even under varying network conditions.

## Overview
WebRTC (Web Real-Time Communication) is the core technology enabling real-time audio, video, and data transfer in RemoteDesk. Optimizing WebRTC is crucial for providing a smooth and responsive remote control experience. This system focuses on dynamically adjusting WebRTC parameters to adapt to network fluctuations, prioritize quality, and minimize latency.

## Features
- **Dynamic Resolution Scaling**: Adjusts video resolution based on available bandwidth and CPU resources to maintain frame rates.
- **Congestion Control**: Implements advanced algorithms to manage network congestion, preventing packet loss and maintaining stream stability.
- **Codec Selection**: Allows configuration of preferred video and audio codecs to balance quality and performance.
- **Bitrate Management**: Dynamically adjusts video and audio bitrates to match network conditions.
- **ICE Server Configuration**: Supports custom STUN/TURN server configurations for improved NAT traversal and connectivity.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`WebRtcCodec`**: An enum defining supported video codecs (e.g., `VP8`, `VP9`, `H264`, `AV1`).
- **`WebRtcQualityPreset`**: An enum for predefined quality settings (e.g., `LOW`, `MEDIUM`, `HIGH`, `ULTRA`).
- **`WebRtcOptimizationConfig`**: Configuration settings for WebRTC optimization, including `preferredCodec`, `defaultQualityPreset`, `dynamicResolutionEnabled`, `congestionControlEnabled`, `maxBitrateMbps`, `minBitrateMbps`, `frameRate`, and `iceServers`.
- **`WebRtcSessionMetrics`**: Represents real-time metrics collected during a WebRTC session (e.g., `currentBitrateMbps`, `packetLossPercentage`, `roundTripTimeMs`, `jitterMs`, `resolutionWidth`, `frameRate`).
- **Location**: `remotedesk/packages/shared/src/performance/webrtc-optimization.dto.ts`

### Desktop Client Service Logic
- **`WebRtcOptimizationService.ts`**: Runs on the desktop client (both host and viewer) to manage and apply WebRTC optimizations.
  - **Configuration Management**: Loads and updates WebRTC optimization settings.
  - **Peer Connection Integration**: Interacts directly with the `RTCPeerConnection` object to set parameters like codecs, bitrates, and frame rates.
  - **Dynamic Adjustment Logic**: Uses `WebRtcSessionMetrics` to detect changes in network conditions (e.g., high packet loss, high RTT) and dynamically adjusts WebRTC parameters (e.g., reducing resolution or bitrate) to maintain session quality.
  - **ICE Server Provisioning**: Provides configured ICE server details to the `RTCPeerConnection` for establishing connections.
- **Location**: `remotedesk/apps/desktop/src/performance/WebRtcOptimizationService.ts`

## Usage

### Configuration
1. **Enable WebRTC Optimization**: In the RemoteDesk admin panel, enable the feature.
2. **Preferred Codec**: Select the desired video codec based on client capabilities and network conditions.
3. **Quality Presets**: Choose a default quality preset or allow dynamic adjustments.
4. **Bitrate and Frame Rate Limits**: Set maximum and minimum bitrates and target frame rates.
5. **ICE Servers**: Configure custom STUN/TURN servers if needed for specific network environments.

### During a Session
- The `WebRtcOptimizationService` continuously monitors session metrics.
- If network conditions degrade, it automatically adjusts parameters to prevent session quality from dropping severely.
- If conditions improve, it scales up parameters to restore optimal quality.

## Technical Considerations
- **Browser/OS Compatibility**: WebRTC implementations can vary across browsers and operating systems, requiring careful testing and potential platform-specific adjustments.
- **SDP Munging**: Advanced WebRTC configuration often involves modifying Session Description Protocol (SDP) offers/answers, which can be complex.
- **Performance Overhead**: Dynamic adjustments should be efficient to avoid adding significant overhead to the client devices.
- **User Experience**: Balancing automatic adjustments with user preferences to avoid disruptive changes.

## Future Enhancements
- **AI-driven Optimization**: Use machine learning to predict network conditions and proactively adjust WebRTC parameters.
- **Per-User/Per-Device Profiles**: Allow administrators to define specific optimization profiles for different users or device types.
- **Advanced Diagnostics**: Provide more detailed WebRTC statistics and diagnostics to help troubleshoot connectivity and performance issues.

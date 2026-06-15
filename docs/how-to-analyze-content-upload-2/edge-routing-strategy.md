# RemoteDesk Edge Routing Strategy

This document describes the Edge Routing Strategy implemented in RemoteDesk to optimize WebRTC connection quality and reduce latency for geographically dispersed users.

## Overview
Edge routing is a critical component for global remote access solutions. By intelligently directing client connections to the nearest and most performant STUN (Session Traversal Utilities for NAT) and TURN (Traversal Using Relays around NAT) servers, RemoteDesk minimizes network latency and improves the overall responsiveness and reliability of remote sessions. This strategy ensures that media traffic takes the shortest and most efficient path between the client and the remote desktop.

## Features
- **Intelligent Server Selection**: Dynamically selects the optimal edge servers based on configurable strategies (e.g., geo-proximity, latency, load).
- **Global Server Network**: Supports a distributed network of STUN/TURN/RELAY servers across various geographical regions.
- **Configurable Strategies**: Allows administrators to choose the routing strategy that best fits their organizational needs and user distribution.
- **Fallback Mechanism**: Provides a fallback to central servers if no suitable edge servers are available or enabled.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`EdgeServerType`**: An enum defining the types of edge servers (`TURN`, `STUN`, `RELAY`).
- **`EdgeServerLocation`**: Describes the geographical location of an edge server, including `region`, `country`, `city`, `latitude`, and `longitude`.
- **`EdgeServer`**: Represents an individual edge server, including its `id`, `type`, `url`, `location`, `load`, `latencyMs`, and `enabled` status.
- **`EdgeRoutingConfig`**: Configuration settings for the edge routing system, such as `enabled`, `strategy` (e.g., `latency_based`, `load_balanced`, `geo_proximity`), `defaultRegion`, and `fallbackToCentral`.
- **`ClientLocation`**: Describes the geographical location of a client, including `ipAddress`, `latitude`, `longitude`, `country`, `region`, and `city`.
- **Location**: `remotedesk/packages/shared/src/performance/edge-routing.dto.ts`

### API Service Logic
- **`EdgeRoutingService.ts`**: Manages the selection of optimal edge servers for clients on the API server.
  - **Configuration Management**: Loads and updates edge routing settings.
  - **Edge Server Management**: Loads and maintains a list of available `EdgeServer`s, including their locations, load, and latency.
  - **Optimal Server Selection**: Implements logic to select the best `EdgeServer`s based on the configured `strategy` and the client's geographical location.
    - **Geo-proximity**: Calculates the distance between the client and available servers to find the closest ones.
    - **Latency-based**: Prioritizes servers with lower measured latency.
    - **Load-balanced**: Distributes connections across servers to balance the load.
  - **Fallback**: If no suitable edge servers are found, it provides central STUN/TURN servers as a fallback.
- **Location**: `remotedesk/apps/api/src/performance/EdgeRoutingService.ts`

## Usage

### Configuration
1. **Enable Edge Routing**: In the RemoteDesk admin panel, enable the feature.
2. **Select Strategy**: Choose the preferred routing strategy (e.g., `geo_proximity` for global deployments, `load_balanced` for high-traffic regions).
3. **Configure Edge Servers**: Provide the URLs and geographical locations of your distributed STUN/TURN/RELAY servers.
4. **Fallback**: Ensure the `fallbackToCentral` option is configured appropriately.

### Client Connection Flow
1. When a client initiates a remote session, it sends its geographical location (derived from IP address) to the RemoteDesk API.
2. The `EdgeRoutingService` uses this information, along with its configured strategy and available edge servers, to determine the optimal STUN/TURN servers.
3. The API returns the list of recommended edge servers to the client.
4. The client then uses these recommended servers to establish its WebRTC peer connection, ensuring the most efficient media path.

## Technical Considerations
- **Geo-IP Accuracy**: The accuracy of client location depends on the Geo-IP service used.
- **Latency Measurement**: Real-time latency measurement to edge servers from clients is crucial for `latency_based` routing.
- **Server Health Monitoring**: Continuous monitoring of edge server load and health is essential for effective routing.
- **Network Topology**: Understanding the underlying network topology can help in deploying and configuring edge servers optimally.

## Future Enhancements
- **Dynamic Server Provisioning**: Automatically provision and de-provision edge servers based on demand.
- **Cost Optimization**: Integrate cost considerations into the routing strategy to balance performance and operational expenses.
- **Client-side Latency Probes**: Implement client-side mechanisms to probe latency to multiple edge servers and report back to the API for more accurate routing decisions.
- **Custom Routing Rules**: Allow administrators to define custom routing rules based on user groups, network segments, or specific application requirements.

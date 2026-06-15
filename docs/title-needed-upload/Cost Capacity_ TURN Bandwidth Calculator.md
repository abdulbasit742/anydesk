# Cost/Capacity: TURN Bandwidth Calculator

This document provides a guide and methodology for estimating the bandwidth requirements for RemoteDesk's TURN (Traversal Using Relays around NAT) servers. Accurate bandwidth estimation is crucial for cost management, capacity planning, and ensuring a high-quality user experience.

## 1. Understanding TURN Bandwidth Consumption

TURN servers relay all media traffic when direct peer-to-peer connections cannot be established. This means that for every relayed session, the TURN server handles both inbound and outbound traffic for both peers. Therefore, a single relayed session consumes bandwidth equivalent to **two times the sum of the uplink and downlink bandwidth of the media stream**.

## 2. Key Factors Influencing Bandwidth

*   **Video Resolution and Frame Rate:** Higher resolutions (e.g., 1080p, 4K) and frame rates (e.g., 30fps, 60fps) consume significantly more bandwidth.
*   **Video Codec:** Different video codecs (e.g., VP8, VP9, H.264, AV1) have varying compression efficiencies.
*   **Audio Codec:** Audio streams typically consume less bandwidth but still contribute.
*   **Number of Concurrent Relayed Sessions:** The total bandwidth is directly proportional to the number of active sessions being relayed.
*   **Network Conditions:** WebRTC's adaptive bitrate algorithms will adjust stream quality based on available bandwidth, which can fluctuate.
*   **Data Channel Traffic:** While typically small, data channel traffic (e.g., remote input, clipboard, file transfer metadata) also adds to the total.

## 3. Bandwidth Estimation Methodology

To estimate TURN server bandwidth, we need to consider the average bandwidth per session and the expected number of concurrent relayed sessions.

### 3.1. Average Bandwidth Per Session (Relayed)

Let's assume a typical RemoteDesk session involves:

*   **Video Stream:** Adaptive, but targeting a certain quality.
*   **Audio Stream:** Constant bitrate.
*   **Data Channel:** Negligible for this calculation, but accounted for in overhead.

**Example Bandwidth Profiles (per peer, one-way):**

| Quality Profile | Video (kbps) | Audio (kbps) | Total One-Way (kbps) |
| :-------------- | :----------- | :----------- | :------------------- |
| **Low (360p)** | 300-500 | 64 | 364-564 |
| **Medium (720p)** | 800-1500 | 64 | 864-1564 |
| **High (1080p)** | 2000-4000 | 64 | 2064-4064 |

**Calculation for a single relayed session:**

`Bandwidth_per_session = 2 * (Client_Uplink_Video + Client_Uplink_Audio + Host_Uplink_Video + Host_Uplink_Audio)`

Since the TURN server relays traffic from both client to host and host to client, and each stream has an uplink and downlink component, the server sees:

`TURN_Server_Bandwidth_per_Session = (Client_Uplink + Client_Downlink) + (Host_Uplink + Host_Downlink)`

Assuming symmetric bandwidth for simplicity for a single stream (e.g., 1080p video from host to client, and some control data from client to host):

If Host sends 1080p video (2000 kbps) and Client sends control (100 kbps):

*   **Host Uplink to TURN:** 2000 kbps (video) + 64 kbps (audio) = 2064 kbps
*   **Client Uplink to TURN:** 100 kbps (control) + 64 kbps (audio) = 164 kbps

*   **TURN Server Ingress:** 2064 kbps (from Host) + 164 kbps (from Client) = 2228 kbps
*   **TURN Server Egress:** 2064 kbps (to Client) + 164 kbps (to Host) = 2228 kbps

**Total TURN Server Bandwidth for ONE session = Ingress + Egress = 2228 kbps + 2228 kbps = 4456 kbps (approx 4.46 Mbps)**

### 3.2. Estimating Concurrent Relayed Sessions

This is highly dependent on user base, network conditions, and the effectiveness of STUN. A common heuristic is that **5-20% of all active sessions might end up being relayed through TURN**.

*   **Total Active Sessions (Peak):** `N`
*   **Percentage of Relayed Sessions:** `P` (e.g., 10% = 0.10)
*   **Concurrent Relayed Sessions (Peak):** `N_relayed = N * P`

### 3.3. Total Peak TURN Bandwidth

`Total_Peak_TURN_Bandwidth = N_relayed * TURN_Server_Bandwidth_per_Session`

**Example Calculation:**

*   Assume 10,000 peak active sessions (`N = 10,000`).
*   Assume 15% of sessions are relayed (`P = 0.15`).
*   Assume average `TURN_Server_Bandwidth_per_Session` is 4.5 Mbps.

`N_relayed = 10,000 * 0.15 = 1,500 concurrent relayed sessions`

`Total_Peak_TURN_Bandwidth = 1,500 * 4.5 Mbps = 6,750 Mbps = 6.75 Gbps`

## 4. Considerations for Cost and Capacity Planning

*   **Cloud Provider Costs:** Cloud providers (AWS, GCP, Azure) charge for data transfer (egress and ingress). This will be a significant operational cost for TURN servers.
*   **Geographical Distribution:** Deploy TURN servers in multiple regions to minimize latency for users and distribute load.
*   **Redundancy:** Implement redundancy (e.g., multiple TURN servers behind a load balancer) to ensure high availability.
*   **Monitoring:** Continuously monitor TURN server bandwidth usage to validate estimates and adjust capacity as needed.
*   **Scalability:** Design the TURN infrastructure to scale horizontally to handle unexpected spikes in usage.
*   **Codec Optimization:** Prioritize efficient video codecs to reduce bandwidth consumption.

## 5. Tools for Monitoring and Validation

*   **TURN Server Metrics:** Most TURN server implementations (e.g., Coturn) provide metrics on active relays, bandwidth usage, and connection attempts.
*   **Cloud Provider Monitoring:** Use cloud provider monitoring tools (e.g., AWS CloudWatch, GCP Monitoring) to track network I/O for TURN server instances.
*   **WebRTC Internals:** `chrome://webrtc-internals` can show if a session is using a TURN relay and the approximate bandwidth of the streams.

## 6. Related Documents

*   `reliability-turn-compatibility-matrix.md`
*   `cost-capacity-cloud-resource-estimation.md`

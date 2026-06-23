# Performance Budgets

To maintain a responsive and reliable platform, we enforce the following performance budgets across the stack.

## API Latency Targets

*   **P50 Latency:** < 50ms
*   **P95 Latency:** < 200ms
*   **Critical Paths (Auth, Session Init):** < 100ms
*   **Alert Threshold:** Sustained P95 > 500ms for 5 minutes.

## Dashboard Load Targets

*   **Time to First Byte (TTFB):** < 100ms
*   **Largest Contentful Paint (LCP):** < 1.5s
*   **First Input Delay (FID):** < 100ms
*   **Cumulative Layout Shift (CLS):** < 0.1
*   **Alert Threshold:** LCP > 2.5s on P75 traffic.

## WebRTC Quality Targets

*   **Connection Setup Time:** < 2000ms
*   **Target Latency (Glass-to-Glass):** < 150ms
*   **Packet Loss Tolerance:** < 2% (acceptable), > 5% (degraded)
*   **Alert Threshold:** ICE failure rate > 5% across the fleet.

## Socket.IO Event Targets

*   **Signaling Event Delivery:** < 50ms
*   **Heartbeat Processing:** < 20ms
*   **Alert Threshold:** Rejected events > 20/minute per node.

## Database Query Expectations

*   **Primary Key Lookups:** < 5ms
*   **Indexed Queries:** < 20ms
*   **Complex Aggregations (e.g., Audit Logs):** < 100ms
*   **Alert Threshold:** Slow queries (> 500ms) exceeding 1% of total query volume.

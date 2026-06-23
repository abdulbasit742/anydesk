# Reliability Engineering Guide

This guide defines the reliability patterns and recovery playbooks for the platform, ensuring high availability and safe degradation during failures.

## Graceful Shutdown

The API server implements a graceful shutdown sequence triggered by `SIGTERM` or `SIGINT`. Upon receiving the signal, the server:
1.  Stops accepting new HTTP connections.
2.  Emits a `server:shutdown` event to all connected Socket.IO clients with a `server_restart` reason.
3.  Disconnects all active sockets.
4.  Flushes logs and closes database connections.
5.  Exits cleanly.

## Retries and Backoff

All clients (desktop agent, web dashboard) implement exponential backoff with jitter for reconnections. 
*   **Initial Delay:** 1000ms
*   **Multiplier:** 2x
*   **Max Delay:** 30000ms
*   **Jitter:** Up to 30% randomization to prevent thundering herds.

## Degraded Mode and Safety

When a client detects an unsafe disconnect or excessive reconnect failures, it enters a degraded mode. Safety actions include:
*   Immediately stopping all remote input processing.
*   Pausing clipboard and file transfer operations.
*   Keeping the emergency stop mechanism available to the user.
*   Displaying clear, safe error messages without exposing internal stack traces or tokens.

## Failure Modes and Recovery Playbook

| Failure Mode | Detection | Automated Action | Manual Recovery |
| :--- | :--- | :--- | :--- |
| **API Down** | `/health` fails, 502/504 errors spike. | Load balancer shifts traffic; clients begin exponential backoff. | Check container logs; verify database connectivity; rollback recent deployment if necessary. |
| **Database Degraded** | Query latency spikes, connection pool exhausted. | API returns 503; read-heavy routes may serve stale cache (if configured). | Check database metrics (CPU/IOPS); terminate long-running queries; scale up instance. |
| **Socket.IO Degraded** | High reconnect rate, rejected events spike. | Alerts triggered; clients back off. | Scale out Socket.IO nodes; verify Redis adapter health. |
| **WebRTC Failures** | High ICE failure rate reported by clients. | Quality metrics trigger alerts. | Verify TURN server credentials and capacity; check for regional network outages. |

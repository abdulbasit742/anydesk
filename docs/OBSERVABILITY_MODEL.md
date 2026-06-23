# Observability Model

This document outlines the observability strategy for the remote desktop platform. Our primary goal is to ensure deep visibility into system performance and reliability while strictly maintaining user privacy and security.

## Core Principles

1.  **Metadata Only:** We only collect metadata. We never collect, log, or transmit raw screen frames, audio/video streams, clipboard contents, file contents, keyboard/mouse inputs, SDP payloads, ICE candidates, or TURN/STUN credentials.
2.  **Redaction by Default:** All logs pass through a `safeLogger` utility that automatically redacts known secret patterns and token-like values.
3.  **No Silent Telemetry:** No data is sent to third-party services without explicit, documented configuration and consent.

## Metrics Collected

### API Metrics
*   **Request Timing:** Method, route pattern, status code, duration (ms), request ID.
*   **Errors:** Error codes mapped to specific routes.
*   **Latency:** Average and P95 latency tracking per route.

### Socket.IO Metrics
*   Active and authenticated connections.
*   Session room counts.
*   Signaling event counts and rejected (unauthorized) event counts.
*   Reconnect rates and disconnect reasons.

### WebRTC Quality Metrics
*   Connection, ICE, and signaling states.
*   Packet loss percentage, bitrate (kbps), frame rate, and resolution (metadata only).
*   Estimated latency (ms) and reconnect attempts.

### Device Heartbeat
*   Last heartbeat timestamp.
*   Missed heartbeat counts.
*   Connection state (connected, degraded, disconnected).

## Infrastructure Components

*   **Request ID Middleware:** Generates and propagates a unique `x-request-id` for tracing requests across boundaries.
*   **Safe Logger:** Provides `debug`, `info`, `warn`, and `error` levels, sanitizing all metadata before output.
*   **Health & Readiness Endpoints:** `/health` and `/health/ready` provide safe status checks without exposing internal configurations.
*   **Ops Metrics Endpoint:** `/api/ops/metrics` aggregates real-time performance data, restricted via RBAC to owners and security admins.

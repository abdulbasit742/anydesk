# WebRTC Diagnostics

## Overview

Real-time diagnostics for WebRTC connections including quality metrics, stats collection, and ICE diagnostics.

## Quality Score

Calculated from:
- Latency (35% weight)
- Packet loss (30% weight)
- Jitter (20% weight)
- Bandwidth (15% weight)

Score ranges: 0-100
- 80-100: Excellent (green)
- 60-79: Good (lime)
- 40-59: Fair (yellow)
- 20-39: Poor (orange)
- 0-19: Critical (red)

## Stats Collection

Collected every 5 seconds via `pc.getStats()`:
- bytesReceived / bytesSent
- packetsReceived / packetsLost
- jitter
- roundTripTime
- availableOutgoingBitrate

## ICE Diagnostics

- Gathering state
- Connection state
- Local/remote candidate types
- Relay detection
- Protocol used (UDP/TCP)

## Reconnect Strategy

- Max attempts: 10
- Base delay: 1s
- Max delay: 30s
- Backoff: 1.5x with jitter

## Implementation

- Contracts: `packages/shared/src/diagnostics/`
- Desktop: `apps/desktop/src/renderer/src/features/diagnostics/`

# Scalability Architecture Plan

This document outlines the roadmap for scaling the remote desktop platform to handle increased load across the API, WebSocket layer, and media relay infrastructure.

## API Scaling

The Express API is designed to be stateless, allowing horizontal scaling via standard load balancing.
*   **Current State:** Single Node.js process.
*   **Next Step:** Containerize the API and deploy across multiple instances behind an Application Load Balancer.
*   **Session State:** All session state must be persisted to the database or a distributed cache (Redis), not in-memory.

## Socket.IO Scaling

Socket.IO handles real-time signaling, device heartbeats, and dashboard presence.
*   **Current State:** In-memory adapter, limiting the system to a single Socket.IO node.
*   **Next Step:** Implement the `@socket.io/redis-adapter` (Placeholder ready). This will allow multiple Socket.IO servers to broadcast and receive events across the cluster.
*   **Session Room Routing:** Clients connect to a room corresponding to their `sessionId`. The Redis adapter ensures messages reach the correct node.

## Database Scaling

*   **Current State:** Single PostgreSQL instance.
*   **Next Step:** Implement read replicas for heavy analytical queries (e.g., audit logs, billing reports) to offload the primary writer.
*   **Connection Pooling:** Ensure PgBouncer or Prisma's built-in connection pooling is configured correctly to handle spikes in concurrent requests.

## Background Job Queue

*   **Current State:** No formal queue; tasks execute synchronously or via simple `setTimeout`.
*   **Next Step:** Implement a robust queueing system (e.g., BullMQ backed by Redis) for asynchronous tasks like email notifications, webhook delivery, and billing synchronization. A placeholder for queue status has been added to the operations dashboard.

## Media and TURN Scaling

WebRTC peer-to-peer connections require STUN/TURN servers for NAT traversal.
*   **Current State:** Relies on direct connections or basic STUN.
*   **Next Step:** Deploy a geographically distributed fleet of TURN servers (e.g., Coturn). The API will need to dynamically issue time-limited, signed TURN credentials to clients based on their region to minimize latency.

# RemoteDesk Architecture Overview

This document provides a high-level overview of the RemoteDesk application's architecture, detailing its main components and how they interact.

## 1. Monorepo Structure

RemoteDesk is organized as a monorepo, containing several distinct applications and shared packages:

-   **`apps/api`**: The backend service, built with Node.js and Express, responsible for user authentication, device management, session coordination, and data persistence.
-   **`apps/web`**: The web-based dashboard, built with Next.js and React, providing a user interface for managing devices, viewing session history, and configuring settings.
-   **`apps/desktop`**: The cross-platform desktop application, built with Electron, serving as both the host (sharing screen) and viewer (remote control) for remote sessions.
-   **`packages/shared`**: A collection of reusable TypeScript types, utility functions, and constants shared across the `api`, `web`, and `desktop` applications.

## 2. Core Technologies

-   **Backend:** Node.js, Express, Prisma (ORM), PostgreSQL (Database), Socket.IO (Signaling).
-   **Frontend (Web):** Next.js, React, TypeScript, TailwindCSS.
-   **Frontend (Desktop):** Electron, React, TypeScript, WebRTC.
-   **Real-time Communication:** WebRTC for peer-to-peer media streaming and data channels, Socket.IO for signaling and control messages.

## 3. Component Interaction Diagram

![RemoteDesk Data Flow Diagram](https://private-us-east-1.manuscdn.com/sessionFile/kSh1cepJyE1z7ba1RxYypL/sandbox/muzsISQlsIV2AJXrXWe21J-images_1781185181957_na1fn_L2hvbWUvdWJ1bnR1L3JlbW90ZWRlc2svZG9jcy9hcmNoaXRlY3R1cmUvZGF0YS1mbG93.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva1NoMWNlcEp5RTF6N2JhMVJ4WXlwTC9zYW5kYm94L211enNJU1Fsc0lWMkFKWHJYV2UyMUotaW1hZ2VzXzE3ODExODUxODE5NTdfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzSmxiVzkwWldSbGMyc3ZaRzlqY3k5aGNtTm9hWFJsWTNSMWNtVXZaR0YwWVMxbWJHOTMucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Qox24NM2E9v2l16LYhK~ExxqFGoNZMrdIzk5tPEsBkok32X4-SyqHQhC-lw4oKbZrfS6Cb2P4Ti2GlOmpuEwuxzNFJohZ~czCuTbc1rv0IwCWZFq7uTcajdw05WQffcAFLT2LpFTSfT~yJsABAxN~oMZ20pDA0XfCJ3eJaoZi0E9HH8qejWGefIe~VMHpKOYmtbR4D-au-5jRD7sl4LtvyLZjHbmEWYsgxvdT55uXYE6Ioqn7r6ZQukImCj4cZdXiXS8-5u0OCDOMnYBH-ToLLIFcGvOkwf1wfAOIdz0Qva9j84LfnkdCCIxkfXeYXSHP2laDBauQEECkTOeimnfHQ__)

## 4. Data Flow

1.  **User Authentication:** Users log in via the Web Dashboard or Desktop App, authenticating with the Backend API. JWTs are used for session management.
2.  **Device Registration:** Desktop applications register themselves with the Backend API, allowing users to manage them from the Web Dashboard.
3.  **Session Initiation:** A user initiates a remote session from either the Web Dashboard or Desktop App. The Backend API coordinates the session setup via Socket.IO signaling.
4.  **WebRTC Connection:** Once signaling is complete, the host and viewer Desktop Apps establish a direct peer-to-peer WebRTC connection for streaming video, audio, and data (e.g., keyboard/mouse input, clipboard sync, file transfer).
5.  **TURN/STUN Servers:** For WebRTC connections to traverse NATs and firewalls, STUN (Session Traversal Utilities for NAT) and TURN (Traversal Using Relays around NAT) servers are used to discover public IP addresses and relay traffic when direct connection is not possible.
6.  **Data Persistence:** User data, device information, and session history are stored in a PostgreSQL database via Prisma ORM.

## 5. Scalability and Reliability Considerations

-   **Backend API:** Designed to be stateless and horizontally scalable. Can be deployed in a cluster behind a load balancer.
-   **Socket.IO Server:** Can be scaled using multiple nodes with a Redis adapter for state sharing.
-   **WebRTC:** Peer-to-peer nature offloads media streaming from central servers, improving scalability. TURN servers can be scaled independently.
-   **Database:** PostgreSQL can be configured for replication and high availability.

This overview provides a foundational understanding. More detailed documentation for each component is available in their respective `docs` subdirectories.

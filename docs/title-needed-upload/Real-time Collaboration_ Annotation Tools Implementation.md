# Real-time Collaboration: Annotation Tools Implementation

This document details the technical implementation of real-time annotation tools within RemoteDesk's collaborative sessions. Annotation tools allow participants to draw, highlight, and add text directly onto the shared remote screen, facilitating clearer communication and instruction during interactive sessions.

## 1. Overview

Annotation tools provide a visual layer over the remote desktop stream, enabling users to interact directly with the content being displayed without affecting the host's actual desktop. These annotations are synchronized in real-time across all participating clients.

## 2. Key Features

*   **Drawing Tools:** Freehand drawing (pen, highlighter) with adjustable color and stroke thickness.
*   **Shapes:** Predefined shapes (rectangle, circle, arrow) for quick emphasis.
*   **Text Tool:** Ability to add temporary text labels to the screen.
*   **Eraser:** Tool to remove individual annotations or clear all annotations.
*   **Undo/Redo:** Basic undo/redo functionality for annotation actions.
*   **Participant-Specific Colors:** Assign unique colors to each annotating participant for easy identification.
*   **Temporary Annotations:** Annotations can fade after a short period or be manually dismissed.

## 3. Technical Implementation

### 3.1. Client-Side Annotation Layer

*   **HTML Canvas:** Each client will render annotations on a transparent HTML `<canvas>` element overlaid on top of the remote video stream. This ensures annotations do not interfere with the actual remote desktop input.
*   **Drawing Logic:** Implement drawing algorithms (e.g., Bresenham's line algorithm for smooth lines) within the canvas context.
*   **Event Listeners:** Capture mouse/touch events on the canvas to detect drawing actions.

### 3.2. Real-time Synchronization

*   **WebRTC Data Channel:** Annotation events (e.g., `drawStart`, `drawMove`, `drawEnd`, `addShape`, `addText`, `erase`) will be sent over a reliable WebRTC Data Channel to all other participants in the session.
*   **Event Payload:** Each event payload will include:
    *   `type`: Type of annotation action (e.g., `draw`, `shape`, `text`, `erase`).
    *   `tool`: Specific tool used (e.g., `pen`, `highlighter`, `rectangle`).
    *   `color`, `thickness`: Style attributes.
    *   `coordinates`: X, Y positions relative to the remote screen resolution.
    *   `data`: Specific data for the tool (e.g., path points for drawing, text content, shape dimensions).
    *   `timestamp`: For ordering and potential conflict resolution.
    *   `participantId`: Identifier of the user who created the annotation.
*   **Broadcast Mechanism:** The host (or a designated central client) can act as a relay for annotation events, or events can be broadcast directly to all peers in a mesh-like fashion (depending on session scale and SFU/MCU architecture).
*   **Idempotency:** Ensure that receiving the same annotation event multiple times does not lead to duplicate rendering.

### 3.3. Annotation State Management

*   **Local State:** Each client maintains its own local state of all active annotations.
*   **Synchronization on Join:** When a new participant joins a session, the current annotation state must be synchronized from an existing participant or the host.
*   **Garbage Collection:** Implement logic to remove temporary annotations after their expiry or when explicitly cleared.

### 3.4. Backend API Integration

*   **Configuration:** API endpoints to configure default annotation settings (e.g., default colors, enabled tools).
*   **Audit Logging:** Log significant annotation actions (e.g., 

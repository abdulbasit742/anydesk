# RemoteDesk In-Session Annotation

This document describes the functionality and implementation of real-time, in-session annotation tools within RemoteDesk, enabling users to draw, highlight, and add text directly onto the remote screen.

## Overview
In-session annotation enhances collaboration and communication during remote sessions. It allows both the host and authorized viewers to visually point out elements, draw attention to specific areas, or add textual notes directly on the shared screen, facilitating clearer instructions and faster problem resolution.

## Features
- **Multiple Annotation Tools**: Support for various tools including pen, highlighter, arrow, text, and eraser.
- **Color and Stroke Width Selection**: Customizable options for annotation appearance.
- **Real-time Synchronization**: Annotations are visible to all participants in real-time.
- **Clear All**: Option to clear all annotations from the screen.
- **Display-Specific Annotations**: Annotations can be tied to specific displays in a multi-monitor setup.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`AnnotationTool`**: An enum defining the available annotation tools.
- **`AnnotationPoint`**: Defines a single point in an annotation, including its coordinates and timestamp.
- **`Annotation`**: Represents a complete annotation, including its ID, session ID, user ID, tool type, color, stroke width, points (for drawing tools), text (for text tool), and creation timestamp.
- **Location**: `remotedesk/packages/shared/src/collaboration/annotation.dto.ts`

### Desktop Application Logic
- **`AnnotationService.ts`**: Manages the lifecycle and state of annotations on the desktop client.
  - **Annotation Creation**: Handles the creation of new annotations based on user input (mouse movements, clicks).
  - **State Management**: Stores active and completed annotations.
  - **Synchronization**: Provides mechanisms to send local annotations to remote participants and receive remote annotations.
  - **Rendering**: (Conceptual) The service would interact with a rendering layer (e.g., a canvas overlay) to display annotations on the remote screen.
- **Location**: `remotedesk/apps/desktop/src/collaboration/AnnotationService.ts`

### User Interface (UI)
- **`AnnotationToolbar.tsx`**: A React component for the desktop application that provides a user interface for selecting annotation tools, colors, and stroke widths, as well as a clear all button.
- **Location**: `remotedesk/apps/desktop/src/collaboration/AnnotationToolbar.tsx`

## Usage

### During a Remote Session
1. Access the annotation toolbar, typically located at the top or side of the remote session window.
2. Select the desired annotation tool (e.g., Pen, Highlighter, Text).
3. Choose a color and stroke width.
4. Draw or type directly on the remote screen. All participants will see the annotations in real-time.
5. Use the eraser tool to remove specific annotations or the "Clear All" button to remove all annotations.

## Technical Considerations
- **Performance**: Ensuring smooth and low-latency rendering of annotations, especially during active screen sharing.
- **Synchronization Conflicts**: Handling concurrent annotations from multiple users and resolving potential conflicts.
- **Layering**: Annotations should overlay the remote screen content without interfering with underlying interactions.
- **Persistence**: Deciding whether annotations should persist across session disconnections or be ephemeral.

## Future Enhancements
- **Annotation History**: Ability to undo/redo annotations.
- **Annotation Permissions**: Granular control over which participants can annotate.
- **Snapshot with Annotations**: Capture a screenshot of the remote screen including all active annotations.
- **Pre-defined Shapes**: Tools for drawing perfect circles, rectangles, and lines.

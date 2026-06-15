# Linux Screen Capture Notes for RemoteDesk

This document details the approaches and considerations for implementing screen capture functionality for RemoteDesk on Linux, particularly focusing on the differences between X11 and Wayland.

## Overview
Screen capture is a core component of any remote desktop application. On Linux, the method for capturing the screen varies significantly depending on whether the desktop environment is running on X11 or Wayland.

## X11 Screen Capture

### Methods
- **XShm (X Shared Memory Extension)**: This is the most efficient method for capturing screen content on X11. It allows direct access to the X server's frame buffer via shared memory, minimizing data copying.
- **XFixes / XDamage**: These extensions can be used to detect changes on the screen, allowing for incremental updates rather than capturing the entire screen each time. This significantly reduces bandwidth and CPU usage.
- **XGetImage**: A more general but less efficient method, suitable as a fallback.

### Implementation Considerations
- **Root Window**: Capture is typically performed on the root window of the X server.
- **Multiple Monitors**: Handle multiple monitors by querying XRandR or Xinerama extensions to get screen geometries and capturing each screen separately or the combined virtual desktop.
- **Hardware Acceleration**: Some X servers might offer hardware-accelerated screen capture, which can be leveraged for better performance.

### Example (Conceptual Xlib/XShm)
```c
// Simplified conceptual code for XShm screen capture
Display *display = XOpenDisplay(NULL);
Window root = DefaultRootWindow(display);
XWindowAttributes attributes;
XGetWindowAttributes(display, root, &attributes);

// Create XShm segment
XShmSegmentInfo shminfo;
shminfo.shmid = shmget(IPC_PRIVATE, attributes.width * attributes.height * 4, IPC_CREAT | 0777);
shminfo.shmaddr = shmat(shminfo.shmid, 0, 0);
shminfo.readonly = False;

XImage *image = XShmCreateImage(display, attributes.visual, attributes.depth, ZPixmap,
                                 shminfo.shmaddr, &shminfo, attributes.width, attributes.height);

// Attach shared memory to X server
XShmAttach(display, shminfo.shmid);

// Capture screen
XShmGetImage(display, root, image, 0, 0, AllPlanes);

// Process image data (e.g., encode and send)

// Detach and clean up
XShmDetach(display, &shminfo);
shmdt(shminfo.shmaddr);
shmctl(shminfo.shmid, IPC_RMID, 0);
XDestroyImage(image);
XCloseDisplay(display);
```

## Wayland Screen Capture

### Methods
- **`xdg-desktop-portal` with PipeWire**: This is the standard and recommended method for screen sharing on Wayland. It provides a secure, standardized API for applications to request screen content from the compositor.
  - **User Consent**: Requires explicit user consent through a system dialog to select which screen or window to share.
  - **PipeWire**: The actual media stream is typically handled by PipeWire, which acts as a media router for audio and video streams on Linux.
- **Direct Compositor APIs (less common/standardized)**: Some compositors might expose their own APIs for screen capture, but relying on these leads to less portability.

### Implementation Considerations
- **Security Model**: Wayland's security model prevents applications from directly accessing other applications' pixels without permission. This means RemoteDesk cannot silently capture the screen.
- **User Interaction**: The user experience must account for the necessary prompts and selections.
- **Compositor Support**: Ensure compatibility with major Wayland compositors (GNOME Shell, KDE Plasma, Sway).

### Example (Conceptual `xdg-desktop-portal`)
```typescript
// Simplified conceptual code for xdg-desktop-portal screen capture (e.g., using Electron/Node.js with a portal library)

// Request screen sharing via xdg-desktop-portal
const source = await xdgDesktopPortal.requestScreenShare();

if (source) {
  // User selected a screen/window
  // Get PipeWire stream ID from source
  const pipeWireStreamId = source.pipeWireStreamId;

  // Use PipeWire to capture the stream
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    // Constraints to get the PipeWire stream
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'pipewire',
        chromeMediaSourceId: pipeWireStreamId,
      },
    },
  });

  // Process mediaStream (e.g., send via WebRTC)
}
```

## Challenges and Solutions
- **Mixed Environments**: Handle systems that might switch between X11 and Wayland sessions.
- **Performance**: Optimize for low latency and high frame rates, especially for interactive remote control.
- **Error Handling**: Gracefully handle cases where permissions are denied or screen capture fails.
- **User Education**: Provide clear instructions and troubleshooting for users, especially regarding Wayland's security prompts.

## Testing
- Test screen capture on various Linux distributions and desktop environments under both X11 and Wayland.
- Verify performance and quality of the captured stream.
- Ensure user prompts for Wayland screen sharing are correctly displayed and handled.
- Test scenarios with multiple monitors and different display resolutions.

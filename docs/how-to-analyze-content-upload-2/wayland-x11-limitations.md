# Wayland/X11 Limitations for RemoteDesk on Linux

This document outlines the differences and limitations RemoteDesk might encounter when operating under Wayland versus X11 display servers on Linux.

## Overview
Linux desktop environments primarily use one of two display server protocols: X11 (also known as X.Org) or Wayland. Wayland is a newer, more secure, and modern protocol, while X11 is older and more widely supported. Remote desktop applications often face challenges due to the fundamental differences in how these protocols handle screen capture and input injection.

## X11 (X.Org)

### Advantages
- **Mature API**: X11 has well-established APIs for screen capture (e.g., XShm, XFixes, XDamage) and input injection (e.g., XTest, XInput).
- **Widespread Compatibility**: Most remote desktop solutions have historically been built for X11 and are generally compatible across various desktop environments running X11.
- **Global Access**: X11 applications can often access and control other applications and the entire desktop without explicit user consent (though this is also a security concern).

### Limitations for RemoteDesk
- **Security Concerns**: The global nature of X11 APIs can be a security risk, as any application can potentially snoop on or inject input into others.
- **Performance**: X11 can sometimes be less performant than Wayland, especially for modern graphics rendering.

## Wayland

### Advantages
- **Enhanced Security**: Wayland is designed with security in mind. Applications are isolated from each other, preventing one application from spying on or controlling another without explicit permission.
- **Modern Architecture**: Better suited for modern graphics hardware and display technologies, potentially offering smoother performance and reduced tearing.

### Limitations for RemoteDesk
- **Screen Capture**: Direct screen capture of the entire desktop is generally not allowed for security reasons. Applications must use specific Wayland protocols (e.g., `xdg-desktop-portal` with PipeWire) to request screen sharing from the compositor. This usually involves a user prompt to select the screen or window to share.
  - **User Interaction Required**: The user must explicitly grant permission for screen sharing, often selecting the specific screen or window to be shared through a system dialog.
  - **Compositor Dependent**: The implementation and capabilities of screen sharing can vary between Wayland compositors (e.g., GNOME Shell, KDE Plasma, Sway).
- **Input Injection**: Similar to screen capture, direct input injection is restricted. Applications need to use specific Wayland protocols (e.g., `libinput` or `wlr_input_inhibitor`) and often require elevated privileges or specific compositor support to inject input globally.
  - **Limited Control**: Remote control might be limited to the application's own windows or require specific compositor features that are not universally available.
  - **Security Prompts**: User consent is typically required for input control, similar to screen sharing.
- **Clipboard Access**: Direct clipboard access across applications might also be restricted, requiring specific protocols.

## RemoteDesk Strategy for Wayland/X11
- **Prioritize Wayland Protocols**: For Wayland, RemoteDesk should leverage `xdg-desktop-portal` and PipeWire for screen sharing and explore available protocols for input injection.
- **Fallback to X11**: If running in an X11 session, utilize X11-specific APIs for screen capture and input.
- **User Guidance**: Provide clear in-app guidance and documentation for users on Wayland, explaining the need for permissions and how to grant them through system dialogs.
- **Feature Parity Challenges**: Achieving full feature parity (especially for unattended access and seamless input control) between X11 and Wayland might be challenging and require ongoing adaptation as Wayland protocols evolve.

## Testing Considerations
- Test RemoteDesk on various Linux distributions and desktop environments running both X11 and Wayland sessions.
- Verify screen sharing and input control functionality under both display servers.
- Document any known limitations or workarounds for specific Wayland compositors.

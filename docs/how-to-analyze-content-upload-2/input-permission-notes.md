# Linux Input Permission Notes for RemoteDesk

This document outlines the considerations and methods for handling input permissions for RemoteDesk on Linux, particularly focusing on the differences between X11 and Wayland.

## Overview
For RemoteDesk to provide full remote control capabilities, it needs to be able to inject keyboard and mouse input into the remote system. On Linux, the mechanisms and permissions required for this vary significantly between X11 and Wayland display servers.

## X11 Input Injection

### Methods
- **XTest Extension**: The XTest extension provides functions like `XTestFakeKeyEvent` and `XTestFakeMotionEvent` to synthesize keyboard and mouse events. This is the most common and straightforward method for input injection on X11.
- **XInput Extension**: For more advanced input devices or scenarios, the XInput extension can be used.

### Implementation Considerations
- **Global Access**: On X11, applications generally have broad access to inject input globally without explicit user prompts, which is both a convenience for remote control and a security concern.
- **Privileges**: Typically, no special privileges beyond being a regular user are required to use XTest, as long as the application has access to the X server.

### Example (Conceptual XTest)
```c
// Simplified conceptual code for XTest input injection
Display *display = XOpenDisplay(NULL);

// Simulate a key press (e.g., 'A')
XTestFakeKeyEvent(display, XKeysymToKeycode(display, XK_A), True, CurrentTime);
XTestFakeKeyEvent(display, XKeysymToKeycode(display, XK_A), False, CurrentTime);

// Simulate mouse movement
XTestFakeMotionEvent(display, -1, 100, 100, CurrentTime);

// Simulate mouse click (Button 1 - left click)
XTestFakeButtonEvent(display, 1, True, CurrentTime);
XTestFakeButtonEvent(display, 1, False, CurrentTime);

XFlush(display);
XCloseDisplay(display);
```

## Wayland Input Injection

### Methods and Limitations
Wayland's security model isolates applications, making global input injection significantly more challenging and restricted than on X11. Direct `XTest`-like global input injection is generally not possible.

- **`libinput` (for local input)**: `libinput` is the standard library for handling input devices on Linux, especially under Wayland. However, it's primarily for consuming input from devices, not injecting it globally into other applications.
- **Wayland Protocols for Input Inhibition/Control**: Some Wayland compositors offer specific protocols that allow applications to gain temporary or limited control over input, often requiring explicit user consent.
  - **`wlr_input_inhibitor` (for Wayland compositors using wlroots)**: This protocol allows an application to inhibit all input events, which can be useful for scenarios like screen lockers or remote control where the remote application needs exclusive input. However, granting this is a high-privilege operation and typically requires user confirmation.
  - **`xdg-remote` (emerging standard)**: This is an evolving protocol aimed at enabling remote desktop scenarios on Wayland, including input injection. Its availability and implementation vary across compositors.

### Implementation Considerations
- **User Consent**: On Wayland, injecting input will almost always require explicit user consent through a system dialog, similar to screen sharing.
- **Compositor Dependence**: The exact method and level of input control can vary significantly between different Wayland compositors (e.g., GNOME Shell, KDE Plasma, Sway).
- **Security Implications**: Due to Wayland's security design, achieving seamless, unattended remote input control might be difficult or impossible without specific compositor features or elevated privileges.
- **Fallback**: If direct input injection is not possible, RemoteDesk might need to rely on accessibility features provided by the desktop environment, if available, or inform the user about the limitation.

## RemoteDesk Strategy for Input Permissions
- **X11**: Utilize XTest for efficient and broad input injection.
- **Wayland**: 
  - Explore and implement input injection using `xdg-remote` or similar emerging Wayland protocols, ensuring proper handling of user consent prompts.
  - If direct injection is not fully supported or too restrictive, provide clear user guidance on how to enable any available accessibility features within their Wayland desktop environment that might facilitate remote control.
  - Be prepared for potential limitations in unattended access scenarios on Wayland due to its security model.

## Testing
- Test keyboard and mouse input injection on various Linux distributions and desktop environments under both X11 and Wayland.
- Verify that user consent prompts for input control on Wayland are correctly displayed and handled.
- Document any known limitations or workarounds for specific Wayland compositors regarding input control.
- Ensure the application provides helpful feedback when input injection is not possible or permissions are denied.

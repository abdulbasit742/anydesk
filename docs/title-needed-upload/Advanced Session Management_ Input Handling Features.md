# Advanced Session Management: Input Handling Features

This document outlines the design and implementation considerations for advanced input handling features within RemoteDesk sessions. These features aim to provide a more flexible, customizable, and optimized input experience for users, particularly for specialized use cases like gaming or specific accessibility needs.

## 1. Overview

Beyond basic keyboard and mouse input, advanced input handling allows for fine-grained control over how local input events are translated and sent to the remote desktop. This includes features like game mode, custom keybindings, and improved touch/stylus support.

## 2. Key Features

*   **Game Mode:** Optimize input for gaming, including:
    *   **Raw Input Passthrough:** Send raw keyboard and mouse events directly to the remote desktop, bypassing OS-level processing.
    *   **Mouse Lock:** Lock the mouse cursor to the remote session window, preventing it from leaving the boundary.
    *   **High Polling Rate:** Increase the frequency of mouse input events for smoother camera control.
*   **Custom Keybindings/Macros:** Allow users to define custom key combinations on the client that trigger specific actions on the remote desktop or within RemoteDesk itself.
*   **Touch/Stylus Support:** Enhanced support for touchscreens and digital pens, including multi-touch gestures and pressure sensitivity.
*   **Gamepad/Joystick Passthrough:** Ability to pass through input from local game controllers to the remote desktop.
*   **Keyboard Layout Synchronization:** Automatically synchronize the client's keyboard layout with the remote desktop's layout.
*   **Input Filtering:** Option to filter out certain input events (e.g., prevent Windows key from opening local Start Menu).

## 3. Technical Considerations

### 3.1. WebRTC Data Channel for Input

*   **Event Serialization:** Input events (keyboard, mouse, touch, gamepad) are serialized into a standardized JSON format and sent over a reliable WebRTC Data Channel.
*   **Event Types:** Define distinct event types for different input sources and actions (e.g., `keyboardEvent`, `mouseMoveEvent`, `touchEvent`, `gamepadEvent`).
*   **Timestamping:** Include timestamps with each event to aid in synchronization and latency compensation.

### 3.2. Client-Side Input Capture

*   **OS-Specific APIs:** Utilize low-level OS APIs for capturing raw input events, especially for game mode, to bypass standard input queues.
    *   **Windows:** Raw Input API, DirectInput.
    *   **macOS:** `IOHIDManager`.
    *   **Linux:** `evdev` (for raw input), XInput/Wayland protocols.
*   **Keyboard Hooks:** Implement global keyboard hooks to capture key presses before they are processed by the local OS, allowing for passthrough or custom actions.
*   **Mouse Hooks:** Implement global mouse hooks for mouse locking and raw movement capture.

### 3.3. Host-Side Input Injection

*   **OS-Specific APIs:** Utilize OS-specific APIs to inject input events into the remote desktop's input queue.
    *   **Windows:** `SendInput` function.
    *   **macOS:** `CGEventPost`.
    *   **Linux:** `xdotool` (for X11), `libinput` (for Wayland).
*   **Virtual Devices:** For game mode or gamepad passthrough, consider creating virtual input devices on the host to mimic physical hardware.

### 3.4. Custom Keybinding Engine

*   **Configuration Storage:** Store user-defined keybindings securely in the backend and synchronize to clients.
*   **Client-Side Mapping:** A client-side engine to intercept local key presses and map them to remote actions or macros.
*   **Conflict Resolution:** Handle conflicts between local OS shortcuts, RemoteDesk shortcuts, and remote desktop actions.

### 3.5. Touch/Stylus Event Translation

*   Translate touch/stylus events (e.g., `touchstart`, `touchmove`, `touchend`, pressure data) into equivalent mouse or custom remote events.
*   Support for multi-touch gestures (e.g., pinch-to-zoom, two-finger scroll) translated into remote desktop actions.

## 4. User Experience

*   **Configurable Settings:** Provide a clear and accessible interface for users to configure input settings.
*   **Visual Feedback:** Indicate when game mode is active or when custom keybindings are in effect.
*   **On-screen Keyboard/Gamepad (Future):** For touch-only devices, an on-screen virtual keyboard or gamepad.

## 5. Performance and Latency

*   **Low Latency:** Minimize the delay between local input and remote action. Efficient capture, transmission, and injection are critical.
*   **Bandwidth:** Raw input passthrough can increase data channel bandwidth, especially for high-frequency mouse movements.

## 6. Security and Privacy

*   **Explicit Permission:** Raw input passthrough and global hooks must require explicit user permission.
*   **Audit Logging:** Log significant input handling changes (e.g., enabling game mode, custom keybinding changes). (Refer to `audit-log-structure.md`)

## 7. Related Documents

*   `data-channel-protocol-tests.md`
*   `desktop-ux-settings.md`
*   `audit-log-structure.md`
*   `security-developer-best-practices.md`

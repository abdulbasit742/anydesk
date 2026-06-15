# RemoteDesk Desktop Client: Renderer Process Debugging Guide

This guide provides instructions for debugging the renderer process of the RemoteDesk Electron desktop client. The renderer process is essentially a Chromium browser instance, and debugging it is similar to debugging a web application.

## 1. Accessing Developer Tools

The primary tool for debugging the renderer process is the Chromium Developer Tools.

### 1.1 Opening DevTools

*   **Keyboard Shortcut**: The most common way to open DevTools is by pressing `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) when the Electron application window is focused.
*   **Context Menu**: Right-click anywhere in the application window and select `Inspect Element` or `Toggle Developer Tools`.
*   **Programmatic**: In your main process, you can open DevTools for a `BrowserWindow` instance:
    ```typescript
    // In main process (e.g., main/index.ts)
    mainWindow.webContents.openDevTools();
    ```

### 1.2 DevTools Sections

Once opened, you will find familiar sections:

*   **Elements**: Inspect and modify the DOM and CSS.
*   **Console**: View `console.log` messages, errors, and execute JavaScript.
*   **Sources**: Set breakpoints, step through code, and inspect variables.
*   **Network**: Monitor network requests (API calls, WebRTC signaling).
*   **Application**: Inspect local storage, session storage, IndexedDB, and service workers.
*   **Performance**: Analyze rendering and JavaScript execution performance.
*   **Memory**: Profile memory usage and detect leaks.

## 2. Common Debugging Techniques

### 2.1 Console Logging

Use `console.log()`, `console.warn()`, `console.error()`, and `console.debug()` throughout your renderer code to output information. These messages will appear in the DevTools Console.

```typescript
// Example in a React component
useEffect(() => {
  console.log("Component mounted with props:", props);
  // ...
}, []);
```

### 2.2 Breakpoints

Set breakpoints in the **Sources** panel to pause JavaScript execution at specific lines of code. This allows you to inspect the call stack, variable values, and step through code execution.

*   **How to set**: Click on the line number in the Sources panel.
*   **Conditional breakpoints**: Right-click on a line number and select `Add conditional breakpoint...` to pause only when a certain condition is met.
*   **`debugger;` statement**: Insert `debugger;` directly into your code to programmatically trigger a breakpoint.

### 2.3 Network Monitoring

The **Network** tab is essential for debugging API calls and WebRTC signaling messages.

*   **Filter requests**: Use the filter bar to narrow down requests by type (XHR, WS for WebSockets).
*   **Inspect WebSocket frames**: For Socket.IO traffic, select the WebSocket connection and go to the `Messages` tab to see sent and received frames.
*   **Check status codes and responses**: Verify that API calls return expected HTTP status codes and response bodies.

### 2.4 State Inspection

If you are using a state management library (e.g., Redux, Zustand, React Context), use browser extensions or DevTools integrations provided by those libraries to inspect the application state.

### 2.5 Preload API Interaction

Since the renderer interacts with the main process via the Preload API (`window.electronAPI`), you can debug these interactions:

*   **Console**: Call `window.electronAPI.someFunction()` directly in the console to test API calls.
*   **Network**: Observe the `Network` tab for `ipcRenderer` messages if your Electron setup logs them.
*   **Main Process Logs**: Correlate renderer actions with main process logs to trace the full flow.

## 3. Troubleshooting Tips

*   **Blank Screen**: If the renderer process shows a blank screen, check the DevTools Console for JavaScript errors. It might be a rendering issue or a critical script failure.
*   **Performance Issues**: Use the **Performance** and **Memory** tabs to identify bottlenecks, expensive operations, or memory leaks.
*   **CORS Errors**: Ensure your API is configured to allow requests from the Electron renderer origin (usually `file://` or `http://localhost:XXXX` in development).
*   **`Uncaught ReferenceError: require is not defined`**: This indicates that Node.js integration is not enabled or configured correctly in your `webPreferences` for the `BrowserWindow`, or you are trying to use Node.js APIs directly in the renderer without a preload script.

---

**Author**: Manus AI
**Date**: June 12, 2026

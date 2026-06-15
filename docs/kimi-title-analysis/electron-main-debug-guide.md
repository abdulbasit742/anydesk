# RemoteDesk Desktop Client: Electron Main Process Debugging Guide

This guide provides instructions for debugging the main process of the RemoteDesk Electron desktop client. The main process is a Node.js environment responsible for native OS interactions, managing renderer processes, and handling IPC.

## 1. Launching with Debugger Attached

The most effective way to debug the main process is to launch Electron with a Node.js inspector attached.

### 1.1 Using `inspect` Flag

Modify your `package.json` script for launching the desktop app in development mode:

```json
// apps/desktop/package.json
{
  "scripts": {
    "dev": "electron-vite dev",
    "dev:main-debug": "electron-vite dev --inspect=5858"
  }
}
```

Then run:

```bash
cd apps/desktop
npm run dev:main-debug # or yarn dev:main-debug
```

This will start the Electron main process and pause its execution on the first line, waiting for a debugger to attach on port `5858`.

### 1.2 Attaching a Debugger

*   **VS Code**: Open VS Code, go to the `Run and Debug` view (Ctrl+Shift+D). Click `create a launch.json file` if you don't have one. Add a new configuration for `Attach to Node Process` or `Attach to Chrome`. A typical `launch.json` entry might look like this:

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        {
          "name": "Attach Main Process",
          "type": "node",
          "request": "attach",
          "port": 5858,
          "restart": true,
          "protocol": "inspector"
        }
      ]
    }
    ```
    Start the `Attach Main Process` configuration after running `npm run dev:main-debug`.

*   **Chrome DevTools**: Open Chrome, navigate to `chrome://inspect`. You should see a `Remote Target` for your Electron app. Click `inspect` to open a dedicated DevTools window for the main process.

## 2. Console Logging

Standard `console.log()`, `console.warn()`, `console.error()` calls in the main process will appear in the terminal where you launched Electron, and also in the attached debugger's console.

## 3. Breakpoints

Similar to the renderer process, you can set breakpoints in the `Sources` panel of the attached debugger to pause execution and inspect variables, call stack, etc.

*   **`debugger;` statement**: Insert `debugger;` directly into your main process code to programmatically trigger a breakpoint.

## 4. IPC Debugging

Inter-Process Communication (IPC) between the main and renderer processes is a critical area for debugging.

*   **Main Process Listeners**: Ensure your `ipcMain.handle` and `ipcMain.on` listeners are correctly set up and receiving messages.
*   **Renderer Process Senders**: Verify that `ipcRenderer.invoke` and `ipcRenderer.send` calls from the renderer are correctly formatted and targeting the right channels.
*   **Logging IPC events**: Add `console.log` statements within your IPC handlers in both main and preload scripts to trace the flow of messages.

    ```typescript
    // Example in main process
    ipcMain.handle("some-channel", async (event, arg) => {
      console.log("Received IPC message on some-channel with arg:", arg);
      // ...
    });
    ```

## 5. Native Module Interactions

If your Electron app interacts with native Node.js modules or system APIs (e.g., `fs`, `path`, `child_process`), debug these interactions carefully.

*   **Error Handling**: Ensure all native calls have robust error handling.
*   **Permissions**: Verify that the main process has the necessary permissions to perform file system operations, network requests, etc.

## 6. Event Emitters

Electron's main process heavily relies on event emitters (e.g., `app`, `BrowserWindow`, `webContents`). Debugging involves ensuring that events are emitted and listened to correctly.

*   **Event Listeners**: Verify that `on` or `once` listeners are correctly registered for relevant events.
*   **Event Payloads**: Inspect the arguments passed with events to ensure they contain the expected data.

## 7. Troubleshooting Tips

*   **Main Process Crash**: If the main process crashes, check the terminal output for stack traces. These often point to unhandled exceptions or native module errors.
*   **IPC Not Working**: Verify channel names are consistent. Check both main and renderer logs for any errors related to IPC. Ensure the preload script is correctly loaded and exposing the API.
*   **Build Issues**: If the main process fails to launch, it might be a build configuration issue. Review `electron-vite` configuration files (`vite.main.config.ts`).

---

**Author**: Manus AI
**Date**: June 12, 2026

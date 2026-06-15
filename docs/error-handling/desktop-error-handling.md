# Desktop Error Handling

## Process Crashes
```typescript
// Main process\process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  // Show error dialog
  dialog.showErrorBox(
    "Unexpected Error",
    "RemoteDesk encountered an error. Please restart the application."
  );
  // Graceful shutdown
  app.quit();
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason);
});
```

## Renderer Crashes
```typescript
// Reload on crash\win.webContents.on("render-process-gone", (event, details) => {
  logger.error("Renderer crashed:", details);
  if (details.reason === "crashed") {
    win.loadURL(HOME_URL); // Reload
  }
});
```

## IPC Error Handling
```typescript
// Preload
const safeInvoke = async (channel: string, ...args: unknown[]) => {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    console.error(`IPC error on ${channel}:`, error);
    throw new UserFriendlyError("Operation failed. Please try again.");
  }
};
```

## Auto-Updater Errors
```typescript
autoUpdater.on("error", (error) => {
  logger.error("Auto-updater error:", error);
  // Don't crash on update errors
  // Silently fail, try again next launch
});
```

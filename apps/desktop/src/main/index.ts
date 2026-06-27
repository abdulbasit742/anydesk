import { app, BrowserWindow, desktopCapturer, ipcMain, shell } from "electron";
import { join } from "node:path";
import { registerClipboardIpc } from "./clipboardIpc.js";
import { registerFileTransferIpc } from "./fileTransferIpc.js";
import { registerInputIpc } from "./input/index.js";
import { registerSupportBundleIpc } from "./supportBundleIpc.js";
import { registerRemoteControlIpc } from "./remoteControlIpc.js";
import { registerTcpTunnelIpc, cleanupAllTunnels } from "./tcpTunnelIpc.js";

let mainWindow: BrowserWindow | null = null;

interface RemoteInputPermissions {
  mouse: boolean;
  keyboard: boolean;
  emergencyStopped: boolean;
  lastChangedAt: number;
}

interface RemoteInputCommand {
  sessionId: string;
  type: string;
  payload: Record<string, unknown>;
}

const inputPermissions = new Map<string, RemoteInputPermissions>();

const defaultInputPermissions: RemoteInputPermissions = {
  mouse: false,
  keyboard: false,
  emergencyStopped: false,
  lastChangedAt: Date.now()
};

function getPermissions(sessionId: string) {
  return inputPermissions.get(sessionId) ?? defaultInputPermissions;
}

function canExecuteInput(command: RemoteInputCommand) {
  const permissions = getPermissions(command.sessionId);
  if (permissions.emergencyStopped) return false;
  if (command.type === "key-down" || command.type === "key-up") return permissions.keyboard;
  return permissions.mouse;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    title: "RemoteDesk",
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

ipcMain.handle("screen:sources", async () => {
  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"],
    thumbnailSize: { width: 320, height: 180 }
  });
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL()
  }));
});

ipcMain.handle("app:platform", () => process.platform);

ipcMain.handle("input:set-permissions", (_event, sessionId: string, permissions: RemoteInputPermissions) => {
  inputPermissions.set(sessionId, { ...permissions, lastChangedAt: Date.now() });
  return { success: true };
});

ipcMain.handle("input:emergency-stop", (_event, sessionId: string) => {
  inputPermissions.set(sessionId, {
    mouse: false,
    keyboard: false,
    emergencyStopped: true,
    lastChangedAt: Date.now()
  });
  return { success: true };
});

ipcMain.handle("input:execute", (_event, command: RemoteInputCommand) => {
  if (!command?.sessionId || !command.type) {
    return {
      success: false,
      mode: "noop",
      reason: "invalid-command",
      executedAt: Date.now()
    };
  }

  if (!canExecuteInput(command)) {
    return {
      success: false,
      mode: "noop",
      reason: "permission-denied",
      commandType: command.type,
      executedAt: Date.now()
    };
  }

  console.log(`[RemoteDesk input noop] ${command.sessionId} ${command.type}`, command.payload);
  return {
    success: true,
    mode: "noop",
    commandType: command.type,
    executedAt: Date.now()
  };
});

registerClipboardIpc();
registerFileTransferIpc();
registerInputIpc();
registerSupportBundleIpc();
registerRemoteControlIpc();
registerTcpTunnelIpc(() => mainWindow);

// Disable hardware acceleration to prevent GPU process crash on some Windows configs
app.disableHardwareAcceleration();

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  cleanupAllTunnels();
  if (process.platform !== "darwin") app.quit();
});

# Native Input Execution Architecture

## Overview

Native input execution is the host-side component that takes validated remote input events and executes them on the local operating system. This document describes the architecture and security requirements.

## Design Principles

1. **Renderer Never Executes**: The renderer process NEVER executes native input directly
2. **Main Process Only**: All native input execution happens in the Electron main process
3. **Permission Gated**: Every execution checks permission state first
4. **Rate Limited**: Maximum events per second prevents abuse
5. **Audit Trail**: All executed input is logged
6. **No-Op Fallback**: Defaults to no-op mode if native dependencies unavailable

## Architecture

```
Renderer Process                    Main Process
+--------------+                   +------------------+
| Input Events | --(IPC)-->       | IPC Handler      |
| (from DC)    |                   |                  |
+--------------+                   | Security Check   |
                                   | - Permission?    |
                                   | - Emergency?     |
                                   | - Rate limit?    |
                                   |                  |
                                   | Platform Executor|
                                   | - Windows        |
                                   | - macOS          |
                                   | - Linux          |
                                   |                  |
                                   | OS API           |
                                   | (SendInput etc)  |
                                   +------------------+
```

## IPC Contract

### Channel Names

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `rd:input:mouse-move` | R→M | Mouse move event |
| `rd:input:mouse-down` | R→M | Mouse down event |
| `rd:input:mouse-up` | R→M | Mouse up event |
| `rd:input:wheel` | R→M | Wheel/scroll event |
| `rd:input:key-down` | R→M | Key down event |
| `rd:input:key-up` | R→M | Key up event |
| `rd:input:initialize` | R→M | Initialize executor |
| `rd:input:dispose` | R→M | Dispose executor |
| `rd:input:result` | M→R | Execution result |

### Security Requirements

Before implementing native execution, the following MUST be in place:

1. **Permission Check**: Verify `permissionState.mouse` / `.keyboard` is true
2. **Emergency Check**: Verify `emergencyStopped` is false
3. **Rate Limit**: Enforce max events per second (configurable, default 1000)
4. **Bounds Check**: Clamp coordinates to display bounds
5. **Restricted Keys**: Block system-critical key combinations
6. **Audit Log**: Log every executed event with timestamp

## Platform Implementations

### Windows

**API Options**:
- **SendInput** (Win32 API) - Most control, requires native addon
- **@nut-tree/nut.js** - Cross-platform, recommended
- **xdotool** - Alternative via CLI

**Key Code Mapping**: Browser `event.code` → Windows Virtual-Key Codes (VK_*)

**Special Considerations**:
- Multi-monitor: Use GetSystemMetrics(SM_CXVIRTUALSCREEN) for virtual desktop
- Elevation: Most input works without admin, some restricted keys may need it
- UAC: Cannot interact with UAC prompts from non-elevated process

**Blocked Combinations**:
- Ctrl+Alt+Del (cannot be simulated - OS security feature)
- Win+L (lock workstation)

### macOS

**API Options**:
- **CoreGraphics** (Quartz Event Services) - Native, requires Accessibility permission
- **@nut-tree/nut.js** - Cross-platform, recommended

**Key Code Mapping**: Browser `event.code` → macOS CGKeyCode

**Special Considerations**:
- **Accessibility Permission REQUIRED**: Must prompt user to grant in System Preferences
- CGEventPost requires trusted accessibility client status
- Check `AXIsProcessTrusted()` before attempting input

**Blocked Combinations**:
- Cmd+Tab (App Switcher)
- Cmd+Q (Quit)
- Cmd+Space (Spotlight)
- Ctrl+Cmd+Q (Lock Screen)

### Linux (X11)

**API Options**:
- **XTest Extension** (libXtst) - Native, most common
- **xdotool** - CLI tool, widely available
- **@nut-tree/nut.js** with libnut backend

**Key Code Mapping**: Browser `event.code` → X11 KeySym → X11 KeyCode

**Special Considerations**:
- X11 vs Wayland: Must detect at runtime
- Wayland: Very limited options - consider PipeWire remote desktop portal
- May need to set `ELECTRON_OZONE_PLATFORM_HINT=x11` on Wayland

**Blocked Combinations**:
- Ctrl+Alt+F1-F12 (Virtual Terminal switch)
- Ctrl+Alt+Del (may trigger reboot on some systems)

## Implementation Priority

1. **Phase 1**: No-Op Executor (DONE) - Safe, for development
2. **Phase 2**: @nut-tree/nut.js integration (RECOMMENDED) - Cross-platform
3. **Phase 3**: Platform-specific native addons (ADVANCED) - Maximum control

## Security Checklist

Before enabling native input execution:

- [ ] Permission gate checks `mouse` / `keyboard` flags
- [ ] Emergency stop state checked before every execution
- [ ] Rate limiting enforced (max 1000 events/sec)
- [ ] Coordinates clamped to display bounds
- [ ] Restricted key combinations blocked
- [ ] Audit log records every execution
- [ ] Renderer has no direct OS API access
- [ ] IPC messages validated in main process
- [ ] No-op mode available for testing
- [ ] User consent obtained before first enable

## Files

| Path | Status | Description |
|------|--------|-------------|
| `apps/desktop/src/main/input/types.ts` | SAFE | Executor interface |
| `apps/desktop/src/main/input/noopExecutor.ts` | SAFE | No-op implementation |
| `apps/desktop/src/main/input/windowsExecutor.ts` | REVIEW_REQUIRED | Design notes |
| `apps/desktop/src/main/input/macOSExecutor.ts` | REVIEW_REQUIRED | Design notes |
| `apps/desktop/src/main/input/linuxExecutor.ts` | REVIEW_REQUIRED | Design notes |
| `apps/desktop/src/preload/input/ipcContract.ts` | REVIEW_REQUIRED | IPC channels |
| `apps/desktop/src/preload/input/inputPreload.ts` | REVIEW_REQUIRED | Preload API |
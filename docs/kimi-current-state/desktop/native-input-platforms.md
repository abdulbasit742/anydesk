# Native Input Platform Support

**Status:** REVIEW_REQUIRED  
**Last Updated:** 2026-06-12  
**Scope:** Platform-Specific Native Input Implementation

---

## Platform Matrix

| Platform | Status | Native API | Permission Required | Code Signing |
|----------|--------|------------|---------------------|--------------|
| Windows | Planned | SendInput | None (UIPI for elevated) | Yes (EV recommended) |
| macOS | Planned | Quartz | Accessibility | Yes (Notarization required) |
| Linux (X11) | Planned | XTest | X11 access | No |
| Linux (Wayland) | Planned | Compositor protocols | Compositor approval | No |

---

## Windows Implementation

### Required APIs
- `SendInput()` - Primary input injection API
- `SetCursorPos()` - Direct cursor positioning
- `GetSystemMetrics(SM_CXSCREEN/SM_CYSCREEN)` - Screen dimensions
- `GetDpiForSystem()` / `GetDpiForMonitor()` - DPI awareness

### Permission Model
Windows allows synthetic input by default. However:
- UIPI (User Interface Privilege Isolation) blocks input to elevated windows
- Antivirus may heuristically detect and block input injection
- SmartScreen may flag unsigned executables

### Code Signing Requirements
- Standard code signing certificate minimum
- EV certificate recommended for SmartScreen reputation
- SHA-256 signature required

### Risks
- Input indistinguishable from real user input
- Potential antivirus false positives
- UAC elevation bypass concerns

---

## macOS Implementation

### Required APIs
- `CGEventCreateMouseEvent()` / `CGEventPost()` - Mouse events
- `CGEventCreateKeyboardEvent()` / `CGEventPost()` - Keyboard events
- `CGEventCreateScrollWheelEvent()` - Scroll events
- `AXIsProcessTrustedWithOptions()` - Permission check

### Permission Model
- Accessibility permission REQUIRED
- User must manually grant in System Preferences
- Application cannot self-grant
- Permission state must be checked before each session

### Code Signing Requirements
- Apple Developer ID certificate
- Notarization required (macOS 10.15+)
- Hardened runtime with automation entitlement

### Hardened Runtime Entitlements
```xml
<key>com.apple.security.automation.apple-events</key>
<true/>
<key>com.apple.security.cs.allow-jit</key>
<true/>
```

### Risks
- Accessibility permission is powerful
- Gatekeeper may block unsigned/notarized apps
- TCC database interaction complexity

---

## Linux Implementation

### X11 Backend
- Uses XTEST extension for synthetic input
- Works on most traditional distributions
- Requires X11 display access
- No security model (any X client can inject input)

### Wayland Backend
- Wayland intentionally blocks synthetic input
- Must use compositor-specific protocols:
  - **wlroots**: `wlr-virtual-pointer-unstable-v1`
  - **GNOME/Mutter**: `org.gnome.Mutter.RemoteDesktop`
  - **KDE**: `org.kde.kwin.RemoteDesktop`
- Requires compositor support and user approval

### Permission Model
- X11: Display access via .Xauthority or xhost
- Wayland: Compositor-specific approval
- No unified permission system

### Risks
- Different behavior per distribution/desktop
- Wayland support is fragmented
- Flatpak/snap sandboxes block input
- X11 security model is weak

---

## Rollback Behavior

If any platform executor fails:
1. Log the failure with detailed error
2. Immediately fall back to NoopInputExecutor
3. Notify the user (host) of the failure
4. Do NOT retry loading the native module
5. Session continues with no-op (logged only)

```typescript
// Rollback pattern
try {
  const platformExecutor = createPlatformExecutor();
  await platformExecutor.initialize();
  setExecutor(platformExecutor, 'platform');
} catch (error) {
  console.error('Platform executor failed, falling back to no-op:', error);
  resetToNoopExecutor();
  notifyUser('Input execution disabled - using safe mode');
}
```

---

## Development Testing

During development, always use NoopInputExecutor:
```typescript
// In development build
setExecutor(createNoopExecutor(), 'noop');
```

Platform executors should only be enabled:
- In CI/CD with security review sign-off
- In production builds with code signing
- After QA testing on target platforms

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-12 | No-op as default | Safety first - no OS execution without review |
| 2026-06-12 | Platform-specific executors | Each OS has different APIs and permissions |
| 2026-06-12 | Windows SendInput | Most reliable, best documented |
| 2026-06-12 | macOS Quartz | Native, no third-party dependencies |
| 2026-06-12 | Linux X11 first | Wayland support is too fragmented |

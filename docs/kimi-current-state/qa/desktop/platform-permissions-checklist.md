# Platform Permissions Checklist

**Status:** REVIEW_REQUIRED  
**Last Updated:** 2026-06-12  
**Scope:** Platform-Specific Permission and Setup Requirements

---

## Windows

### Development
- [ ] App runs without elevation
- [ ] No-op executor works on Windows
- [ ] IPC handlers register successfully
- [ ] No antivirus false positives in development

### Production (REVIEW_REQUIRED)
- [ ] Code signed with valid certificate
- [ ] SmartScreen reputation established (EV cert)
- [ ] UIPI behavior tested with elevated apps
- [ ] SendInput works on Windows 10/11
- [ ] SendInput works on Windows Server 2019+
- [ ] Antivirus compatibility tested (Defender, McAfee, Norton)
- [ ] Group policy compatibility verified

---

## macOS

### Development
- [ ] App runs without accessibility permission
- [ ] No-op executor works on macOS
- [ ] IPC handlers register successfully
- [ ] No Gatekeeper blocks in development

### Production (REVIEW_REQUIRED)
- [ ] Apple Developer ID certificate
- [ ] Notarization completed successfully
- [ ] Hardened runtime entitlements correct
- [ ] Accessibility permission prompt shown
- [ ] Accessibility permission check before session
- [ ] TCC database interaction tested
- [ ] CGEvent works on macOS 12+
- [ ] Works on Apple Silicon (M1/M2/M3)
- [ ] Works on Intel Macs

---

## Linux

### Development
- [ ] App runs on Ubuntu 22.04+
- [ ] No-op executor works on Linux
- [ ] IPC handlers register successfully

### X11 (REVIEW_REQUIRED)
- [ ] XTEST extension available
- [ ] Input works on X11 with xdotool alternative
- [ ] .Xauthority handling correct
- [ ] Multi-monitor X11 setup tested

### Wayland (REVIEW_REQUIRED)
- [ ] wlroots compositor support tested
- [ ] GNOME/Mutter support tested
- [ ] KDE support tested
- [ ] Graceful fallback when protocol unavailable
- [ ] Flatpak/snap sandbox behavior verified

### Distributions
- [ ] Ubuntu 22.04 LTS
- [ ] Ubuntu 24.04 LTS
- [ ] Fedora 40+
- [ ] Debian 12+

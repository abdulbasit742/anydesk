# Prompt #26: AnyDesk Feature Benchmark Matrix

**Date:** 2026-06-23
**Repository:** AnyDesk (Backend & Desktop Client)

| Feature Category | AnyDesk Standard | RemoteDesk Current State | Readiness % | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Core Connection** | Sub-16ms latency, global relay network, direct P2P fallback. | Broken API, no signaling, stubbed WebRTC. | 0% | The backend cannot start; no connections can be established. |
| **Screen Sharing** | High framerate, adaptive bitrate, multi-monitor support. | `desktopCapturer` scaffolded, but no actual stream transmission. | 5% | UI components exist, but native capture to WebRTC pipeline is missing. |
| **Remote Control** | Native OS-level mouse/keyboard injection, UAC bypass. | IPC stubs exist (`canExecuteInput`), but no native OS bindings. | 5% | Relies on missing native modules (e.g., robotjs or custom C++ addons). |
| **File Transfer** | Bidirectional, resume support, directory sync. | IPC stubs exist (`registerFileTransferIpc`), but no actual transfer logic. | 5% | UI components exist, but underlying protocol is not implemented. |
| **Clipboard Sync** | Text, images, files, bidirectional sync. | IPC stubs exist (`registerClipboardIpc`), but no native clipboard hooks. | 5% | Electron clipboard API is partially used, but sync logic is incomplete. |
| **Security** | End-to-end encryption (TLS/DTLS), 2FA, access control lists. | JWT auth scaffolded, but no E2EE implementation for WebRTC streams. | 10% | Basic auth exists, but advanced security features are missing. |
| **Cross-Platform** | Windows, macOS, Linux, iOS, Android. | Electron scaffold for desktop, no mobile clients. | 10% | Electron build is currently broken. |

## Summary
RemoteDesk is currently a conceptual scaffold. It lacks the deep native OS integrations and robust WebRTC signaling infrastructure required to compete with AnyDesk.

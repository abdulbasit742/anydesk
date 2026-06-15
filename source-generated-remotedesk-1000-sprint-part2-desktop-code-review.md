# RemoteDesk Part 2 Desktop Code Review Guide

Prioritize these review areas:

1. IPC safety: confirm no raw path or Node API reaches renderer. Path tokens must stay main-process scoped.
2. File transfer: verify explicit receiver acceptance and save target choice before writes.
3. Clipboard: verify disabled-by-default behavior and no content logging.
4. Remote input: verify no-op executor remains default and emergency stop closes the permission gate.
5. Reconnect: wire only through existing authenticated signaling and avoid replacing current offer/answer flow.
6. Tests: adjust import aliases to match the repo test runner.

Merge order: tests/docs, IPC shells, renderer services, UI components, integration patches.

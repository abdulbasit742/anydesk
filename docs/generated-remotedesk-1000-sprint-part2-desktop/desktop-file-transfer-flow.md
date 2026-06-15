# Desktop file transfer flow

File transfer is disabled by default. The sender selects files through the narrow Electron picker IPC, the renderer sends a `file.offer` message over the existing session data channel, and the receiver must choose a save location before `file.accept` is sent. Files are chunked, ACK/NACK is applied per chunk, and completion verifies expected byte count before finalization. Dangerous extensions are blocked by renderer policy before offer or acceptance.

No received file is silently auto-saved. The main process exposes path tokens instead of raw paths to the renderer.

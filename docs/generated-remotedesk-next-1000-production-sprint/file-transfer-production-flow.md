# File Transfer Production Flow

Outgoing files are policy-checked, offered over the data channel, explicitly accepted, saved only after recipient chooses a target path, chunked, ACK/NACKed, and checksum verified.

## Review Gates

- Confirm imports match the current repository.
- Do not overwrite working runtime files blindly.
- Keep native input disabled by default.

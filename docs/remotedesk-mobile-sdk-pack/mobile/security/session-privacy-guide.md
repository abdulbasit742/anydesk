# Session Privacy Guide

## Screen Capture
- Host screen capture is local only; no cloud relay.
- Disable iOS screen recording indicator if possible (private API risk).

## Chat & Input
- Data channel messages encrypted via DTLS-SRTP.
- No persistent chat logs on mobile unless user opts in.

## Disconnect Policy
- Auto-disconnect on background > 60s unless "keep alive" enabled.
- Clear remote frame buffer on disconnect.

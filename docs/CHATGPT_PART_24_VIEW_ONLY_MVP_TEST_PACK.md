# ChatGPT Part 24 — View-Only MVP Test Pack

Branch: `chatgpt/24-view-only-mvp-test-pack`

## Purpose

This part adds a focused test checklist for the PC-to-PC view-only MVP.

The goal is no longer to add more features. The goal is to verify whether the current work can connect two machines and show a consented host screen to the viewer.

## Based on

- Part 20 backend route foundation
- Part 21 Socket.IO/WebRTC signaling foundation
- Part 22 desktop host helper and dashboard viewer route

## Main verification path

1. API starts
2. Desktop host logs in
3. Desktop host registers device
4. Dashboard shows device online
5. Viewer opens `/dashboard/viewer?deviceId=<DEVICE_ID>`
6. Viewer requests view-only session
7. Host receives consent request
8. Host accepts
9. Host sends WebRTC offer
10. Viewer sends WebRTC answer
11. ICE candidates exchange
12. Viewer sees host screen
13. Emergency stop ends the session

## Files added

- `docs/VIEW_ONLY_MVP_TEST_CHECKLIST.md`
- `docs/CHATGPT_PART_24_VIEW_ONLY_MVP_TEST_PACK.md`

## Safety

This part does not enable remote input, clipboard sync, file transfer, unattended access, silent access, or recording.

## Next part

Part 25 should only be started after this checklist is run. If view-only video fails, Part 25 should fix the first failing step instead of adding new features.

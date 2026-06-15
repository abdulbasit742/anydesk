# Desktop Manual QA Checklist


## Incoming connections
- [ ] Incoming request shows the accept/reject modal with requester name
- [ ] Countdown ticks down and auto-rejects at 30s
- [ ] Accepting starts the session; rejecting returns to idle
- [ ] A second request queues and prompts after the first resolves
- [ ] Consent history records every decision


## Screen capture
- [ ] Source picker lists all screens and windows with thumbnails

 - [ ] Selecting a source starts capture
 - [ ] Denying OS permission shows the permission prompt + retry
 - [ ] Multi-monitor: each monitor is selectable


 ## Session
 - [ ] Remote video renders within ~2s of connect
 - [ ] Status badge reflects connecting â†’ connected â†’ reconnecting
 - [ ] Quality indicator changes color under throttled network
 - [ ] Zoom in/out/reset works; fullscreen toggles
 - [ ] Disconnect modal confirms before ending
 - [ ] Network drop triggers reconnect, then resumes


 ## Remote input
 - [ ] Mouse moves/clicks register on host
 - [ ] Keyboard input registers; blocked keys (Meta) stay local
 - [ ] Revoking host input permission stops input application

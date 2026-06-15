# RemoteDesk Manual QA Checklist

This checklist guides manual quality assurance testing for the RemoteDesk application across web and desktop platforms.

## General Testing

- [ ] **Installation/Setup:**
    - [ ] Verify successful installation of desktop app on Windows, macOS, Linux.
    - [ ] Verify web app deploys and loads correctly in major browsers (Chrome, Firefox, Edge, Safari).
    - [ ] Confirm all environment variables are correctly picked up.
- [ ] **Basic Functionality:**
    - [ ] Create a new user account and log in.
    - [ ] Connect two devices (host and viewer) and establish a remote session.
    - [ ] Verify screen sharing works correctly.
    - [ ] Verify remote input (keyboard/mouse) works correctly.
    - [ ] Disconnect and reconnect a session.
- [ ] **Error Handling:**
    - [ ] Test various error scenarios (e.g., network disconnect, invalid credentials, server down) and verify appropriate error messages are displayed.
    - [ ] Confirm error boundaries catch unexpected UI errors.

## Web Dashboard Testing

- [ ] **Dashboard Overview:**
    - [ ] Verify all overview widgets display correct and up-to-date information.
    - [ ] Check data consistency between widgets and detailed pages.
- [ ] **Devices Page:**
    - [ ] List all registered devices.
    - [ ] Verify device online/offline status is accurate.
    - [ ] Rename a device.
    - [ ] Trust/Untrust a device.
    - [ ] Delete a device (with confirmation).
    - [ ] Verify device audit history is recorded correctly.
- [ ] **Sessions History Page:**
    - [ ] List all past sessions.
    - [ ] Apply filters (date, device, user, status).
    - [ ] Search for specific sessions.
    - [ ] Export session history to CSV.
    - [ ] View session details and audit timeline.
- [ ] **Billing Page:**
    - [ ] Verify subscription status and plan details.
    - [ ] Check invoice history.
    - [ ] Test upgrade/downgrade plan flows (if implemented).
- [ ] **Settings Pages:**
    - [ ] Update profile settings (email, name).
    - [ ] Change password.
    - [ ] Verify security settings (e.g., 2FA enablement).
- [ ] **Auth Flows:**
    - [ ] Test login, signup, forgot password, reset password, email verification flows.
    - [ ] Verify session persistence across browser restarts.
    - [ ] Test route guards for unauthorized access.

## Desktop Application Testing

- [ ] **Session UX:**
    - [ ] Verify session toolbar controls (disconnect, settings) function correctly.
    - [ ] Test reconnect banner functionality.
    - [ ] Confirm disconnect confirmation modal appears.
    - [ ] Observe remote video loading and error states.
    - [ ] Verify host sharing and viewer connected indicators.
    - [ ] Check session quality badge accuracy.
    - [ ] Verify session duration timer works.
    - [ ] Add notes to session and verify persistence.
- [ ] **Settings:**
    - [ ] Configure general settings (start on boot, minimize to tray).
    - [ ] Adjust display quality settings.
    - [ ] Configure network settings (proxy).
    - [ ] Update security settings (require password on connect).
    - [ ] Modify input permission settings.
    - [ ] Test file transfer and clipboard sync settings.
    - [ ] Verify 

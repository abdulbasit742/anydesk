# RemoteDesk Smoke Test Checklist

This checklist outlines essential smoke tests to quickly verify the core functionality of the RemoteDesk application after a new deployment or build.

## Web Application Smoke Tests

- [ ] **Application Load:** Verify the web application loads successfully in a browser.
- [ ] **Login/Logout:** Successfully log in with an existing user and log out.
- [ ] **Dashboard Access:** Navigate to the main dashboard page without errors.
- [ ] **Device Listing:** Verify the devices page loads and displays at least one device (if available).
- [ ] **Session History Access:** Verify the session history page loads.
- [ ] **Basic Navigation:** Click through primary navigation links (e.g., Dashboard, Devices, Sessions, Settings) and ensure pages load without critical errors.

## Desktop Application Smoke Tests

- [ ] **Application Launch:** Verify the desktop application launches successfully.
- [ ] **Login:** Successfully log in with an existing user.
- [ ] **Dashboard/Main Screen:** Verify the main application screen loads without errors.
- [ ] **Remote Connection:** Initiate and successfully establish a remote desktop connection to another device.
- [ ] **Screen Sharing:** Verify the remote screen is visible and updating.
- [ ] **Remote Input:** Test basic keyboard and mouse input on the remote machine.
- [ ] **Disconnect Session:** Successfully disconnect from a remote session.
- [ ] **Settings Access:** Open the settings panel and navigate through a few sections.

## Backend API Smoke Tests

- [ ] **API Health Check:** Access the backend health endpoint and verify a successful response.
- [ ] **User Authentication:** Successfully call the login API endpoint with valid credentials.
- [ ] **Device API:** Call the API to list devices and verify a successful response.
- [ ] **Session API:** Call the API to list sessions and verify a successful response.
- [ ] **Database Connectivity:** Verify the API can connect to the database and perform basic queries.

## Overall System Health

- [ ] **Network Connectivity:** Verify all components (web, desktop, backend, TURN server) can communicate with each other.
- [ ] **Logging:** Check application logs for any critical errors or warnings immediately after deployment.
- [ ] **Basic Performance:** Observe initial load times and responsiveness; ensure no obvious performance bottlenecks.

**Note:** These tests are designed for quick verification. A full QA cycle should follow for comprehensive testing.

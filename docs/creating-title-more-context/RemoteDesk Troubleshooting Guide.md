# RemoteDesk Troubleshooting Guide

This guide provides common troubleshooting steps for issues encountered while using or developing RemoteDesk.

## General Issues

### Application Not Starting

-   **Check Logs:** Review application logs for error messages. For web, check browser console and server logs. For desktop, check developer console (Ctrl+Shift+I or Cmd+Option+I) and system logs.
-   **Dependencies:** Ensure all project dependencies are installed correctly (`npm install` or `yarn install`).
-   **Environment Variables:** Verify all required environment variables are set and correctly configured.
-   **Port Conflicts:** Ensure no other applications are using the same ports required by RemoteDesk (e.g., 3000 for web, 3001 for API/Socket.IO).

### Network Connectivity Problems

-   **Firewall:** Check local and server firewalls to ensure necessary ports are open (e.g., 3478 for TURN, 3001 for Socket.IO).
-   **Internet Connection:** Verify both host and viewer devices have a stable internet connection.
-   **TURN Server:** If experiencing WebRTC connection issues, ensure the TURN server is running and accessible (`docs/release/turn-server-deploy.md`).
-   **Proxy Settings:** If using a proxy, ensure it is correctly configured in both the application and system settings.

## Web Application Issues

### Blank Page or UI Errors

-   **Browser Console:** Open the browser's developer console (F12) and check for JavaScript errors.
-   **API Connectivity:** Verify the web application can reach the backend API. Check network requests in the browser developer tools.
-   **Caching:** Clear browser cache and cookies.

### Authentication Problems

-   **Invalid Credentials:** Double-check username and password. Try password reset if necessary.
-   **Token Expiry:** Ensure authentication tokens are being refreshed or re-authenticated when expired.
-   **CORS Issues:** If seeing CORS errors, ensure your backend API is configured to allow requests from your web application's origin.

## Desktop Application Issues

### Screen Sharing Not Working

-   **Permissions:** Ensure the desktop application has necessary screen recording permissions granted by the operating system.
-   **MediaStream Errors:** Check the desktop application's developer console for `MediaStream` related errors.
-   **WebRTC Connection:** Verify the WebRTC connection is established. Check ICE candidates and connection state.

### Remote Input Lag or Unresponsiveness

-   **Network Latency:** High network latency can cause input lag. Check network conditions.
-   **System Resources:** Ensure neither the host nor viewer device is under heavy CPU/memory load.
-   **Display Quality:** Lowering the display quality settings in the desktop app might improve responsiveness.

## Backend API Issues

### API Endpoints Returning Errors

-   **Server Logs:** Check the backend server logs for detailed error messages and stack traces.
-   **Database Connection:** Verify the API can connect to the database. Check `DATABASE_URL` and database server status.
-   **Dependencies:** Ensure all backend dependencies are installed and up-to-date.

### High CPU/Memory Usage

-   **Profiling:** Use Node.js profiling tools to identify performance bottlenecks.
-   **Database Queries:** Optimize slow database queries.
-   **Scalability:** Consider scaling up or out your backend services if under heavy load.

## Reporting Issues

If you encounter an issue not covered here, please report it with the following information:

-   Detailed description of the problem.
-   Steps to reproduce.
-   Error messages from logs or console.
-   Screenshots or video recordings (if applicable).
-   Operating system and browser versions.
-   RemoteDesk application version.
